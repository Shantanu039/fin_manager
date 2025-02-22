import React, { useEffect, useState } from "react";
import { Button, Container, Table } from "react-bootstrap";
import moment from "moment";
import EditNoteIcon from "@mui/icons-material/EditNote";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import axios from "axios";
import ExpenseAlert from "../../components/ExpenseAlert";
import TransactionForm from "../../components/TransactionForm";
import { deleteTransactions, editTransactions } from "../../utils/ApiRequest";
import "./home.css";

const TableData = (props) => {
  const [show, setShow] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [currId, setCurrId] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [user, setUser] = useState(null);

  const [values, setValues] = useState({
    title: "",
    amount: "",
    description: "",
    category: "",
    date: "",
    transactionType: "",
  });

  useEffect(() => {
    setUser(props.user);
    setTransactions(props.data);
  }, [props.data, props.user, refresh]);

  // Calculate total expense (only for expenses, not credits)
  const totalExpense = transactions
    .filter((item) => item.transactionType === "Expense")
    .reduce((acc, item) => acc + Number(item.amount), 0);

  const expenseLimit = 4000; // Set an expense limit for alert

  const handleEditClick = (itemKey) => {
    console.log("Clicked button ID:", itemKey);
    if (transactions.length > 0) {
      const editTran = props.data.find((item) => item._id === itemKey);
      setCurrId(itemKey);
      setEditingTransaction(editTran);
      setShow(true);
    }
  };

  const handleDeleteClick = async (itemKey) => {
    console.log("Clicked button ID delete:", itemKey);
    setCurrId(itemKey);

    const { data } = await axios.post(`${deleteTransactions}/${itemKey}`, {
      userId: props.user._id,
    });

    if (data.success === true) {
      setRefresh(!refresh);
      window.location.reload();
    } else {
      console.log("error");
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    const { data } = await axios.put(`${editTransactions}/${currId}`, {
      ...values,
    });

    if (data.success === true) {
      setShow(false);
      setRefresh(!refresh);
      window.location.reload();
    } else {
      console.log("error");
    }
  };

  return (
    <>
      <Container>
        
        {/* Expense Alert */}
        <ExpenseAlert totalExpense={totalExpense} limit={expenseLimit} />

        {/* Transactions Table */}
        <Table responsive="md" className="data-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Title</th>
              <th>Amount</th>
              <th>Type</th>
              <th>Category</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody className="text-white">
            {props.data.map((item, index) => (
              <tr key={index}>
                <td>{moment(item.date).format("YYYY-MM-DD")}</td>
                <td>{item.title}</td>
                <td>{item.amount}</td>
                <td>{item.transactionType}</td>
                <td>{item.category}</td>
                <td>
                  <div className="icons-handle">
                    <EditNoteIcon
                      sx={{ cursor: "pointer" }}
                      id={item._id}
                      onClick={() => handleEditClick(item._id)}
                    />

                    <DeleteForeverIcon
                      sx={{ color: "red", cursor: "pointer" }}
                      id={item._id}
                      onClick={() => handleDeleteClick(item._id)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>

      {/* Transactions Form for Editing */}
      <TransactionForm
        show={show}
        handleClose={() => setShow(false)}
        handleSubmit={handleEditSubmit}
        editingTransaction={editingTransaction}
        values={values}
        setValues={setValues}
      />
    </>
  );
};

export default TableData;
