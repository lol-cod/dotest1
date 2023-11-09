import React, { useState, useEffect } from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  TextField,
  Grid,
  Paper,
  MenuItem,
} from '@mui/material';

function FinanceFields({
  modeOfPayment,
  paymentType,
  setPaymentType,
  payeeName,
  setPayeeName,
  actualAmountReceived,
  setActualAmountReceived,
  paymentReceivedOn,
  setPaymentReceivedOn,
  paymentShortage,
  setPaymentShortage,
  inrAmountCreditedInBank,
  setInrAmountCreditedInBank,
  dateOfCredit,
  setDateOfCredit,
  transactionCode,
  exchangeRate,
  setExchangeRate,
  setTransactionCode,
  remarks,
  setRemarks,
  totalAmount,
}) {
  const showAllFieldsModes = [
    'MEDICARE UBI',
    'MEDISELLER KOTAK',
    'MEDICARE KOTAK',
    'MEDISELLER UBI',
    'MEDISELLER IDFC',
  ];

  const showRemarksOnlyModes = [
    'SANDEEP GUPTA UBI',
    '%%%',
    '$$$',
    'UK BANK ACCOUNT',
    'MANISHA GUPTA UBI',
  ];

  const handlePaymentTypeChange = (e) => {
    setPaymentType(e.target.value);
  };

  const handleExchangeRateChange = (e) => {
    setExchangeRate(e.target.value);
  };

  useEffect(() => {
    // Calculate Payment Shortage
    if (!isNaN(totalAmount) && !isNaN(actualAmountReceived)) {
      const shortage = (totalAmount - actualAmountReceived) * exchangeRate;
      setPaymentShortage(shortage);
    }

    // Calculate INR amount credited in the bank when the exchange rate or actual amount received changes
    if (exchangeRate && !isNaN(actualAmountReceived)) {
      const inrCredited = exchangeRate * actualAmountReceived;
      setInrAmountCreditedInBank(inrCredited);
    }
  }, [totalAmount, actualAmountReceived, exchangeRate]);

  return (
    <Paper elevation={3} style={{ padding: '16px', marginBottom: '16px' }}>
      <Grid container spacing={2}>
        {showAllFieldsModes.includes(modeOfPayment) && (
          <>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Select Payment Type</InputLabel>
                <Select
                  value={paymentType}
                  onChange={handlePaymentTypeChange}
                >
                  <MenuItem value="Bank Advice">Bank Advice</MenuItem>
                  <MenuItem value="Direct INR">Direct INR</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {paymentType === 'Bank Advice' && (
              <>
                <Grid item xs={12} md={4}>
                  <TextField
                    label="Exchange Rate"
                    type="number"
                    value={exchangeRate}
                    onChange={handleExchangeRateChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    label="Payee Name"
                    value={payeeName}
                    onChange={(e) => setPayeeName(e.target.value)}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    label="Actual Amount Received"
                    type="number"
                    value={actualAmountReceived}
                    onChange={(e) =>
                      setActualAmountReceived(e.target.value)
                    }
                    fullWidth
                  />
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <TextField
                    label="Payment Received On"
                    type="date"
                    placeholder="mm/dd/yyyy"
                    InputLabelProps={{ shrink: true }}
                    value={paymentReceivedOn}
                    onChange={(e) =>
                      setPaymentReceivedOn(e.target.value)
                    }
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    label="Payment Shortage"
                    type="number"
                    value={paymentShortage}
                    onChange={(e) =>
                      setPaymentShortage(e.target.value)
                    }
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    label="INR Amount Credited in Bank"
                    type="number"
                    value={inrAmountCreditedInBank}
                    onChange={(e) =>
                      setInrAmountCreditedInBank(e.target.value)
                    }
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    label="Date of Credit"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={dateOfCredit}
                    onChange={(e) => setDateOfCredit(e.target.value)}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    label="Transaction Code"
                    value={transactionCode}
                    onChange={(e) => setTransactionCode(e.target.value)}
                    fullWidth
                  />
                </Grid>
              </>
            )}
          </>
        )}
        {paymentType === 'Direct INR' && (
          <>
            <Grid item xs={12} md={4}>
              <TextField
                label="Payee Name"
                value={payeeName}
                onChange={(e) => setPayeeName(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="Actual Amount Received"
                type="number"
                value={actualAmountReceived}
                onChange={(e) => setActualAmountReceived(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="Date of Credit"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={dateOfCredit}
                onChange={(e) => setDateOfCredit(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <InputLabel>Select Transaction Code</InputLabel>
                    <Select
                      value={transactionCode}
                      onChange={(e) => setTransactionCode(e.target.value)}
                    >
                      <MenuItem value="IMPS">IMPS</MenuItem>
                      <MenuItem value="NEFT">NEFT</MenuItem>
                      <MenuItem value="RTGS">RTGS</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
          </>
        )}
        {showRemarksOnlyModes.includes(modeOfPayment) && (
          <Grid item xs={12}>
            <TextField
              label="Remarks"
              fullWidth
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />
          </Grid>
        )}
      </Grid>
    </Paper>
  );
}

export default FinanceFields;
