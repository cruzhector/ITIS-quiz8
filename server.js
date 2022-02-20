const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const { check, validationResult } = require("express-validator");
const { getConnection } = require("./helper");
const {
  companyRegValidation,
  companyUpdateValidation,
  companyNameValidation,
  companyDelValidation,
} = require("./validation");
const OPTIONS = require("./swagger-config.json");

const PORT = process.env.PORT || 3000;
const app = express();
const specs = swaggerJsDoc(OPTIONS);

app.use(cors());
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/**
 * @swagger
 * components:
 *   schemas:
 *     Company:
 *       type: object
 *       required:
 *         - companyId
 *         - companyName
 *         - companyCity
 *       properties:
 *         companyId:
 *           type: string
 *           description: Company ID
 *         companyName:
 *           type: string
 *           description: The company name
 *         companyCity:
 *           type: string
 *           description: The company city
 *       example:
 *         companyId: 45
 *         companyName: Wendys
 *         companyCity: Charlotte
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Customer:
 *       type: object
 *       properties:
 *         CUST_CODE:
 *           type: string
 *         CUST_NAME:
 *           type: string
 *         CUST_CITY:
 *           type: string
 *         WORKING_AREA:
 *           type: string
 *         CUST_COUNTRY:
 *           type: string
 *         GRADE:
 *           type: string
 *         OPENING_AMT:
 *           type: string
 *         RECEIVE_AMT:
 *           type: string
 *         PAYMENT_AMT:
 *           type: string
 *         OUTSTANDING_AMT:
 *           type: string
 *         PHONE_NO:
 *           type: string
 *         AGENT_CODE:
 *           type: string
 *     Order:
 *       type: object
 *       properties:
 *         ORD_NUM:
 *           type: string
 *         ORD_AMOUNT:
 *           type: string
 *         ADVANCE_AMOUNT:
 *           type: string
 *         ORD_DATE:
 *           type: string
 *         CUST_CODE:
 *           type: string
 *         AGENT_CODE:
 *           type: string
 *         ORD_DESCRIPTION:
 *           type: string
 *     Agent:
 *       type: object
 *       properties:
 *         AGENT_CODE:
 *           type: string
 *         AGENT_NAME:
 *           type: string
 *         WORKING_AREA:
 *           type: string
 *         COMMISSION:
 *           type: string
 *         PHONE_NO:
 *           type: string
 *         COUNTRY:
 *           type: string
 */

/**
 * @swagger
 * /company:
 *   post:
 *     summary: Registers a company
 *     tags: [Company]
 *     requestBody:
 *       content:
 *          application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  companyId:
 *                    type: string
 *                    example: 45
 *                  companyName:
 *                    type: string
 *                    example: Wendys
 *                  companyCity:
 *                    type: string
 *                    example: Charlotte
 *     responses:
 *       200:
 *         description: Succesfully registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       422:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Could not register
 */
app.post("/company", companyRegValidation, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  let body = req.body;
  getConnection()
    .then((conn) => {
      conn
        .query("INSERT INTO company value (?,?,?)", [
          body.companyId,
          body.companyName,
          body.companyCity,
        ])
        .then((rows) => {
          conn.release();
          return res.json(rows);
        })
        .catch((err) => {
          console.log(err);
          conn.end();
          res.status(500).send("Error");
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Error");
    });
});

/**
 * @swagger
 * /companies:
 *   get:
 *     summary: Returns the list of all the companies
 *     tags: [Company]
 *     responses:
 *       200:
 *         description: The list of the companies
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Company'
 *       422:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Could not get companies
 */
app.get("/companies", (req, res) => {
  getConnection()
    .then((conn) => {
      conn
        .query("SELECT * from company")
        .then((rows) => {
          conn.release();
          res.header("Content-Type", "application/json; charset=utf-8");
          return res.status(200).json(rows);
        })
        .catch((err) => {
          conn.end();
          console.log(err);
          res.status(500).send("Error");
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Error");
    });
});

/**
 * @swagger
 * /company/{id}:
 *   put:
 *     summary: Updates company data
 *     tags: [Company]
 *     requestBody:
 *       content:
 *          application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  companyName:
 *                    type: string
 *                    example: Boja
 *                  companyCity:
 *                    type: string
 *                    example: Harrisburg

 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           example: 45
 *         required: true
 *         description: id that needs to be updated
 *     responses:
 *       200:
 *         description: Succesfully updated
 *         contens:
 *           application/json:
 *             schema:
 *               type: object
 *       422:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Could not get company
 */
app.put("/company/:id", companyUpdateValidation, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  let body = req.body;
  let id = req.params.id;

  getConnection()
    .then((conn) => {
      conn
        .query(
          "UPDATE company SET COMPANY_NAME = ?, COMPANY_CITY = ?  WHERE COMPANY_ID = ?",
          [body.companyName, body.companyCity, id]
        )
        .then((rows) => {
          conn.release();
          res.header("Content-Type", "application/json; charset=utf-8");
          return res.status(200).json(rows);
        })
        .catch((err) => {
          conn.end();
          console.log(err);
          res.status(500).send("Error");
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Error");
    });
});

/**
 * @swagger
 * /company:
 *   patch:
 *     summary: Updates company name
 *     tags: [Company]
 *     requestBody:
 *       content:
 *          application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  companyId:
 *                    type: string
 *                    example: 45
 *                  companyName:
 *                    type: string
 *                    example: Starbucks
 *     responses:
 *       200:
 *         description: Succesfully updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       422:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Could not update name
 */
app.patch("/company", companyNameValidation, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  let body = req.body;
  getConnection()
    .then((conn) => {
      conn
        .query("UPDATE company SET COMPANY_NAME = ? WHERE COMPANY_ID = ?", [
          body.companyName,
          body.companyId,
        ])
        .then((rows) => {
          conn.release();
          res.header("Content-Type", "application/json; charset=utf-8");
          return res.status(200).json(rows);
        })
        .catch((err) => {
          conn.end();
          console.log(err);
          res.status(500).send("Error");
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Error");
    });
});

/**
 * @swagger
 * /company/{id}:
 *   delete:
 *     summary: Deletes a company with specified id
 *     tags: [Company]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           example: 45
 *         required: true
 *         description: id that needs to be deleted
 *     responses:
 *       200:
 *         description: Succesfully deleted.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       422:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Could not delete company
 */
app.delete("/company/:id", companyDelValidation, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  let id = req.params.id;
  getConnection()
    .then((conn) => {
      conn
        .query("DELETE FROM company where COMPANY_ID = ?", id)
        .then((rows) => {
          conn.release();
          res.header("Content-Type", "application/json; charset=utf-8");
          return res.status(200).json(rows);
        })
        .catch((err) => {
          conn.end();
          console.log(err);
          res.status(500).send("Error");
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Error");
    });
});

/**
 * @swagger
 * /customers:
 *   get:
 *     summary: Gets all list of customers
 *     tags: [Customer]
 *     responses:
 *       200:
 *         description: list of all customers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Customer'
 *       422:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Could not get customers
 */
app.get("/customers", (req, res) => {
  getConnection()
    .then((conn) => {
      conn
        .query("SELECT * from customer")
        .then((rows) => {
          conn.release();
          res.header("Content-Type", "application/json; charset=utf-8");
          return res.status(200).json(rows);
        })
        .catch((err) => {
          conn.end();
          console.log(err);
          res.status(500).send("Error");
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Error");
    });
});

/**
 * @swagger
 * /customer/{id}:
 *   get:
 *     summary: Gets a customer with specified id
 *     tags: [Customer]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           example: C00001
 *         required: true
 *         description: Customer id
 *     responses:
 *       200:
 *         description: customer with specified id
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       422:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Could not get customer
 */
app.get(
  "/customer/:id",
  [check("id", "id must not be empty").isLength({ min: 1 })],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    var id = req.params.id;
    getConnection()
      .then((conn) => {
        conn
          .query(`SELECT * from customer where CUST_CODE = ?`, id)
          .then((rows) => {
            conn.release();
            return res.json(rows);
          })
          .catch((err) => {
            conn.end();
            console.log(err);
            res.status(500).send("Error");
          });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("Error");
      });
  }
);

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Gets all list of orders
 *     tags: [Order]
 *     responses:
 *       200:
 *         description: list of all orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       422:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Could not get orders
 */
app.get("/orders", (req, res) => {
  getConnection()
    .then((conn) => {
      conn
        .query(`SELECT * from orders`)
        .then((rows) => {
          conn.release();

          return res.json(rows);
        })
        .catch((err) => {
          console.log(err);
          conn.end();
          res.status(500).send("Error");
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Error");
    });
});

/**
 * @swagger
 * /order:
 *   get:
 *     summary: Gets all the orders starting with specified string
 *     tags: [Order]
 *     parameters:
 *       - in: query
 *         name: searchString
 *         schema:
 *           type: string
 *           example: S
 *         required: true
 *         description: String used to search orders
 *     responses:
 *       200:
 *         description: list of all orders that match the specified search string
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       422:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Could not get orders
 */
app.get(
  "/order",
  [
    check("searchString", "searchString must not be empty").isLength({
      min: 1,
    }),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    var searchString = req.query.searchString;
    searchString = searchString.concat("%");
    getConnection()
      .then((conn) => {
        conn
          .query(
            `SELECT * from orders where ORD_DESCRIPTION like ?`,
            searchString
          )
          .then((rows) => {
            conn.release();
            if (rows.length !== 0) {
              return res.json(rows);
            } else {
              return res.json({
                message: `Could not find order description starting with ${searchString.substring(
                  0,
                  searchString.indexOf("%")
                )}`,
              });
            }
          })
          .catch((err) => {
            console.log(err);
            conn.end();
            res.status(500).send("Error");
          });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("Error");
      });
  }
);
/**
 * @swagger
 * /order-amount:
 *   get:
 *     summary: Gets all the orders with total amount greater than the specified amount
 *     tags: [Order]
 *     parameters:
 *       - in: query
 *         name: total
 *         schema:
 *           type: string
 *           example: 3000
 *         required: true
 *         description: total amount
 *     responses:
 *       200:
 *         description: list of all orders greater than the specified amount
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       422:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Could not get orders
 */
app.get(
  "/order-amount",
  [
    check("total", "total must not be empty").isLength({
      min: 1,
    }),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    var totalAmount = req.query.total;
    getConnection()
      .then((conn) => {
        conn
          .query(`select * from orders where ORD_AMOUNT > ?`, totalAmount)
          .then((rows) => {
            conn.release();

            if (rows.length !== 0) {
              return res.json(rows);
            } else {
              return res.json({
                message: `There are no orders`,
              });
            }
          })
          .catch((err) => {
            console.log(err);
            conn.end();
            res.status(500).send("Error");
          });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("Error");
      });
  }
);

/**
 * @swagger
 * /students-report:
 *   get:
 *     summary: Gets all the student reports with specified class and section
 *     tags: [Student]
 *     parameters:
 *       - in: query
 *         name: class
 *         schema:
 *           type: string
 *           example: V
 *         required: true
 *         description: Class
 *       - in: query
 *         name: section
 *         schema:
 *           type: string
 *           example: A
 *         required: true
 *         description: Section
 *     responses:
 *       200:
 *         description: list of all the student reports of a class and section.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       422:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Could not get report
 */
app.get(
  "/students-report",
  [
    check("class", "class must not be empty").isLength({
      min: 1,
    }),
    check("section", "section must not be empty").isLength({
      min: 1,
    }),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    var className = req.query.class;
    var section = req.query.section;
    getConnection()
      .then((conn) => {
        conn
          .query(
            `SELECT * from studentreport where CLASS = ? AND SECTION = ?`,
            [className, section]
          )
          .then((rows) => {
            conn.release();

            if (rows.length !== 0) {
              return res.json(rows);
            } else {
              return res.json({
                message: `Could not find the looking row`,
              });
            }
          })
          .catch((err) => {
            console.log(err);
            conn.end();
            res.status(500).send("Error");
          });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("Error");
      });
  }
);

/**
 * @swagger
 * /agents:
 *   get:
 *     summary: Gets all the agents in the specified area and commission.
 *     tags: [Agent]
 *     parameters:
 *       - in: query
 *         name: area
 *         schema:
 *           type: string
 *           example: Bangalore
 *         required: true
 *         description: areas to include
 *       - in: query
 *         name: commission
 *         schema:
 *           type: string
 *           example: 0.15
 *         required: true
 *         description: commission of the agent
 *     responses:
 *       200:
 *         description: list of all the agents that matches the criteria.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Agent'
 *       422:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Could not get agents
 */
app.get(
  "/agents",
  [
    check("area", "area must not be empty").isLength({
      min: 1,
    }),
    check("commission", "commission must not be empty").isLength({
      min: 1,
    }),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    let area = req.query.area;
    let commission = req.query.commission;
    getConnection()
      .then((conn) => {
        conn
          .query(
            `SELECT * from agents where WORKING_AREA = ? AND COMMISSION <= ?`,
            [area, commission]
          )
          .then((rows) => {
            conn.release();

            if (rows.length !== 0) {
              return res.json(rows);
            } else {
              return res.json({
                message: `Could not find the looking row`,
              });
            }
          })
          .catch((err) => {
            console.log(err);
            conn.end();
            res.status(500).send("Error");
          });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("Error");
      });
  }
);

/**
 * @swagger
 * /student/{class}:
 *   get:
 *     summary: Gets a student details of a class and section
 *     tags: [Student]
 *     parameters:
 *       - in: path
 *         name: class
 *         schema:
 *           type: string
 *           example: V
 *         required: true
 *         description: class
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *           example: 15
 *         required: true
 *         description: Student id
 *       - in: query
 *         name: section
 *         schema:
 *           type: string
 *           example: A
 *         required: true
 *         description: Sections
 *     responses:
 *       200:
 *         description: Student details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       422:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Could not students
 */
app.get(
  "/student/:class",
  [
    check("id", "id must not be empty").isLength({
      min: 1,
    }),
    check("class", "class must not be empty").isLength({
      min: 1,
    }),
    check("section", "section must not be empty").isLength({
      min: 1,
    }),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    let className = req.params.class;
    let id = req.query.id;
    let section = req.query.section;

    getConnection()
      .then((conn) => {
        conn
          .query(
            `SELECT * from student where ROLLID = ? AND CLASS=? AND SECTION=?`,
            [id, className, section]
          )
          .then((rows) => {
            conn.release();

            if (rows.length !== 0) {
              return res.json(rows);
            } else {
              return res.json({
                message: `Could not find the looking row`,
              });
            }
          })
          .catch((err) => {
            console.log(err);
            conn.end();
            res.status(500).send("Error");
          });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("Error");
      });
  }
);

/**
 * @swagger
 * /company-foods/{id}:
 *   get:
 *     summary: Gets all food products of a company
 *     tags: [Company, Food]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           example: 16
 *         required: true
 *         description: id of the company
 *     responses:
 *       200:
 *         description: list of food products of a company.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       422:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Could not get company foods
 */
app.get(
  "/company-foods/:id",
  [
    check("id", "id must not be empty").isLength({
      min: 1,
    }),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    let id = req.params.id;
    getConnection()
      .then((conn) => {
        conn
          .query(`SELECT * from foods where COMPANY_ID = ?`, id + "\r")
          .then((rows) => {
            if (rows.length !== 0) {
              return res.json(rows);
            } else {
              return res.json({
                message: `Could not find the looking row`,
              });
            }
          })
          .catch((err) => {
            console.log(err);
            conn.end();
            res.status(500).send("Error");
          });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("Error");
      });
  }
);

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
