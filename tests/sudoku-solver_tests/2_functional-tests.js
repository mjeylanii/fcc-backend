const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = chai.assert;
const server = require("../../server");
const { puzzlesAndSolutions } = require("../../controllers/puzzle-strings");
chai.use(chaiHttp);

suite("Sodoku solver Functional Tests", () => {
  test("Solve a puzzle with valid puzzle string: POST request to /api/solve", function (done) {
    chai
      .request(server)
      .post("/api/solve")
      .send({ puzzle: puzzlesAndSolutions[0][0] })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.solution, puzzlesAndSolutions[0][1]);
        done();
      });
  });

  test("Solve a puzzle with missing puzzle string: POST request to /api/solve", function (done) {
    chai
      .request(server)
      .post("/api/solve")
      .send({})
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "Required field missing");
        done();
      });
  });

  test("Solve a puzzle with invalid characters: POST request to /api/solve", function (done) {
    chai
      .request(server)
      .post("/api/solve")
      .send({ puzzle: puzzlesAndSolutions[0][0].replace("1", "A") })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "Invalid characters in puzzle");
        done();
      });
  });

  test("Solve a puzzle with incorrect length: POST request to /api/solve", function (done) {
    chai
      .request(server)
      .post("/api/solve")
      .send({ puzzle: puzzlesAndSolutions[0][0].slice(1) })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(
          res.body.error,
          "Expected puzzle to be 81 characters long",
        );
        done();
      });
  });

  test("Solve a puzzle that cannot be solved: POST request to /api/solve", function (done) {
    chai
      .request(server)
      .post("/api/solve")
      .send({
        puzzle: puzzlesAndSolutions[0][0].replace("1", "."),
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.solution, puzzlesAndSolutions[0][1]);
        done();
      });
  });

  test("Check a puzzle placement with all fields: POST request to /api/check", function (done) {
    chai
      .request(server)
      .post("/api/check")
      .send({ puzzle: puzzlesAndSolutions[0][0], coordinate: "A2", value: "3" })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.valid, true);
        done();
      });
  });

  test("Check a puzzle placement with single placement conflict: POST request to /api/check", function (done) {
    chai
      .request(server)
      .post("/api/check")
      .send({ puzzle: puzzlesAndSolutions[0][0], coordinate: "A2", value: "4" })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.valid, false);
        assert.equal(res.body.conflict.length, 1);
        done();
      });
  });

  test("Check a puzzle placement with multiple placement conflicts: POST request to /api/check", function (done) {
    chai
      .request(server)
      .post("/api/check")
      .send({ puzzle: puzzlesAndSolutions[0][0], coordinate: "A2", value: "5" })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.valid, false);
        assert.equal(res.body.conflict.length, 2);
        done();
      });
  });

  test("Check a puzzle placement with all placement conflicts: POST request to /api/check", function (done) {
    chai
      .request(server)
      .post("/api/check")
      .send({ puzzle: puzzlesAndSolutions[0][0], coordinate: "A2", value: "2" })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.valid, false);
        assert.equal(res.body.conflict.length, 3);
        done();
      });
  });

  test("Check a puzzle placement with missing required fields: POST request to /api/check", function (done) {
    chai
      .request(server)
      .post("/api/check")
      .send({ coordinate: "A2", value: "5" })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "Required field(s) missing");
        done();
      });
  });

  test("Check a puzzle placement with invalid characters: POST request to /api/check", function (done) {
    chai
      .request(server)
      .post("/api/check")
      .send({
        puzzle: puzzlesAndSolutions[0][0].replace("1", "A"),
        coordinate: "A2",
        value: "5",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "Invalid characters in puzzle");
        done();
      });
  });

  test("Check a puzzle placement with incorrect length: POST request to /api/check", function (done) {
    chai
      .request(server)
      .post("/api/check")
      .send({
        puzzle: puzzlesAndSolutions[0][0].slice(1),
        coordinate: "A2",
        value: "5",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(
          res.body.error,
          "Expected puzzle to be 81 characters long",
        );
        done();
      });
  });

  test("Check a puzzle placement with invalid placement coordinate: POST request to /api/check", function (done) {
    chai
      .request(server)
      .post("/api/check")
      .send({ puzzle: puzzlesAndSolutions[0][0], coordinate: "Z2", value: "5" })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "Invalid coordinate");
        done();
      });
  });

  test("Check a puzzle placement with invalid placement value: POST request to /api/check", function (done) {
    chai
      .request(server)
      .post("/api/check")
      .send({ puzzle: puzzlesAndSolutions[0][0], coordinate: "A2", value: "0" })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "Invalid value");
        done();
      });
  });
});
