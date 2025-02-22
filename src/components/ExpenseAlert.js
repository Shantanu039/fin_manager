import React from "react";
import { Alert } from "react-bootstrap";

const ExpenseAlert = ({ totalExpense, limit }) => {
  return (
    <>
      {totalExpense > limit && (
        <Alert variant="danger">
          <strong>Warning:</strong> Your total expenses have exceeded the limit of ₹{limit}!
        </Alert>
      )}
    </>
  );
};

export default ExpenseAlert;
