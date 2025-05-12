const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const paypal = require("../../helpers/paypal");
const { randomUUID } = require("crypto");

const createOrder = async (req, res) => {
  try {
    const {
      userId,
      userName,
      userEmail,
      orderStatus,
      paymentMethod,
      paymentStatus,
      orderDate,
      paymentId,
      payerId,
      instructorId,
      instructorName,
      courseImage,
      courseTitle,
      courseId,
      coursePricing,
    } = req.body;

    const create_payment_json = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      redirect_urls: {
        return_url: `${process.env.CLIENT_URL}/payment-return`,
        cancel_url: `${process.env.CLIENT_URL}/payment-cancel`,
      },
      transactions: [
        {
          item_list: {
            items: [
              {
                name: courseTitle,
                sku: courseId,
                price: coursePricing,
                currency: "USD",
                quantity: 1,
              },
            ],
          },
          amount: {
            currency: "USD",
            total: coursePricing.toFixed(2),
          },
          description: courseTitle,
        },
      ],
    };

    paypal.payment.create(create_payment_json, async (error, paymentInfo) => {
      if (error) {
        console.error(error);
        return res.status(500).json({
          success: false,
          message: "Error while creating PayPal payment!",
        });
      }

      const approveUrl = paymentInfo.links.find(link => link.rel === "approval_url")?.href;

      const newOrder = await prisma.order.create({
        data: {
          id: randomUUID(),
          user_id: userId,
          user_name: userName,
          user_email: userEmail,
          order_status: orderStatus,
          payment_method: paymentMethod,
          payment_status: paymentStatus,
          order_date: new Date(orderDate),
          payment_id: paymentId,
          payer_id: payerId,
          instructor_id: instructorId,
          instructor_name: instructorName,
          course_image: courseImage,
          course_title: courseTitle,
          course_id: courseId,
          course_pricing: coursePricing,
        },
      });

      res.status(201).json({
        success: true,
        data: {
          approveUrl,
          orderId: newOrder.id,
        },
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

const capturePaymentAndFinalizeOrder = async (req, res) => {
  try {
    const { paymentId, payerId, orderId } = req.body;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order cannot be found",
      });
    }

    // Update order
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        payment_status: "paid",
        order_status: "confirmed",
        payment_id: paymentId,
        payer_id: payerId,
      },
    });

    // Thêm vào bảng student_courses
    await prisma.studentCourse.create({
      data: {
        user_id: order.user_id,
        course_id: order.course_id,
        title: order.course_title,
        instructor_id: order.instructor_id,
        instructor_name: order.instructor_name,
        date_of_purchase: new Date(),
        course_image: order.course_image,
      },
    });

    // Thêm vào bảng course_students
    await prisma.courseStudent.create({
      data: {
        course_id: order.course_id,
        student_id: order.user_id,
        student_name: order.user_name,
        student_email: order.user_email,
        paid_amount: order.course_pricing,
      },
    });

    res.status(200).json({
      success: true,
      message: "Order confirmed",
      data: updatedOrder,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

module.exports = { createOrder, capturePaymentAndFinalizeOrder };
