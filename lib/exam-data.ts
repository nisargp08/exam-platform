// Account options for the dropdown
export const accountOptions = [
  { value: "cash", label: "Cash", institution: null },
  { value: "accounts_receivable", label: "Accounts Receivable", institution: null },
  { value: "inventory", label: "Inventory", institution: null },
  { value: "supplies", label: "Supplies", institution: null },
  { value: "equipment", label: "Equipment", institution: null },
  { value: "accounts_payable", label: "Accounts Payable", institution: null },
  { value: "notes_payable", label: "Notes Payable", institution: null },
  { value: "unearned_revenue", label: "Unearned Revenue", institution: null },
  { value: "common_stock", label: "Common Stock", institution: null },
  { value: "retained_earnings", label: "Retained Earnings", institution: null },
  { value: "dividends", label: "Dividends", institution: null },
  { value: "revenue", label: "Revenue", institution: null },
  { value: "rent_expense", label: "Rent Expense", institution: null },
  { value: "salaries_expense", label: "Salaries Expense", institution: null },
  { value: "utilities_expense", label: "Utilities Expense", institution: null },
  { value: "insurance_expense", label: "Insurance Expense", institution: null },
  { value: "depreciation_expense", label: "Depreciation Expense", institution: null },
  { value: "interest_expense", label: "Interest Expense", institution: null },
  { value: "accumulated_depreciation", label: "Accumulated Depreciation", institution: null },
  { value: "prepaid_insurance", label: "Prepaid Insurance", institution: null },
  { value: "prepaid_rent", label: "Prepaid Rent", institution: null },
  { value: "interest_receivable", label: "Interest Receivable", institution: null },
  { value: "wages_payable", label: "Wages Payable", institution: null },
  { value: "interest_payable", label: "Interest Payable", institution: null },
  { value: "income_tax_expense", label: "Income Tax Expense", institution: null },
  { value: "income_tax_payable", label: "Income Tax Payable", institution: null },
  { value: "bad_debt_expense", label: "Bad Debt Expense", institution: null },
  { value: "allowance_doubtful_accounts", label: "Allowance for Doubtful Accounts", institution: null },
  { value: "merchandise_inventory", label: "Merchandise Inventory", institution: null },
  { value: "cost_of_goods_sold", label: "Cost of Goods Sold", institution: null },
  { value: "sales_revenue", label: "Sales Revenue", institution: null },
  { value: "sales_returns", label: "Sales Returns and Allowances", institution: null },
  { value: "sales_discounts", label: "Sales Discounts", institution: null },
  { value: "purchases", label: "Purchases", institution: null },
  { value: "purchase_returns", label: "Purchase Returns and Allowances", institution: null },
  { value: "purchase_discounts", label: "Purchase Discounts", institution: null },
  { value: "freight_in", label: "Freight In", institution: null },
  { value: "freight_out", label: "Freight Out", institution: null },
  { value: "land", label: "Land", institution: null },
  { value: "buildings", label: "Buildings", institution: null },
  { value: "accumulated_depreciation_buildings", label: "Accumulated Depreciation - Buildings", institution: null },
  { value: "motor_vehicles", label: "Motor Vehicles", institution: null },
  { value: "accumulated_depreciation_vehicles", label: "Accumulated Depreciation - Vehicles", institution: null },
  { value: "computers", label: "Computers", institution: null },
  { value: "accumulated_depreciation_computers", label: "Accumulated Depreciation - Computers", institution: null },
  { value: "machinery", label: "Machinery", institution: null },
  { value: "accumulated_depreciation_machinery", label: "Accumulated Depreciation - Machinery", institution: null },
  { value: "professional_tax", label: "Professional Tax", institution: null },
  { value: "tds_payable", label: "TDS Payable", institution: null },
  { value: "pf_employee", label: "PF - Employee Contribution", institution: null },
  { value: "pf_employer", label: "PF - Employer Contribution", institution: null },
  { value: "pf_expense", label: "PF Expense", institution: null },
  { value: "pf_contribution_payable", label: "PF - Contribution Payable", institution: null },
  { value: "salary_payable", label: "Salary Payable", institution: null },
  { value: "bank_loan", label: "Bank Loan", institution: null },
  { value: "gain_on_sale", label: "Gain on Sale of Assets", institution: null },
  { value: "loss_on_sale", label: "Loss on Sale of Assets", institution: null },
  { value: "bank_account", label: "Bank Account", institution: null },
  { value: "fixed_deposit", label: "Fixed Deposit", institution: null },
  { value: "tds_receivable", label: "TDS Receivable", institution: null },
  { value: "interest_income", label: "Interest Income", institution: null },
  { value: "electricity_expense", label: "Electricity Expense", institution: null },
  { value: "electricity_payable", label: "Electricity Payable", institution: null },
  { value: "prepaid_electricity", label: "Prepaid Electricity", institution: null },
  { value: "accrued_electricity", label: "Accrued Electricity", institution: null },
  { value: "debtors", label: "Debtors", institution: null },
  { value: "creditors", label: "Creditors", institution: null },
  { value: "sales", label: "Sales", institution: null },
  { value: "sales_return", label: "Sales Return", institution: null },
  { value: "discount_allowed", label: "Discount Allowed", institution: null },
  { value: "unexpired_interest", label: "Unexpired Interest", institution: null },
  { value: "abc_corporation", label: "ABC Corporation", institution: "ABC Corporation" },
  { value: "abc_pvt_ltd", label: "ABC Pvt Ltd", institution: "ABC Pvt Ltd" },
]

// Exam questions
export const examQuestions = [
  {
    id: 1,
    scenario: "Purchase goods worth Rs 10,000 on 28/03/2019.",
    correctFirstEntry: {
      account: "purchases",
      entryType: "debit",
      amount: 10000,
    },
    correctSecondEntry: {
      account: "cash", // Changed from accounts_payable to cash
      entryType: "credit",
      amount: 10000,
    },
  },
  {
    id: 2,
    scenario:
      "Salary for the month to Mr. A is Rs. 30,000\nProfessional Tax - Rs. 200\nTDS - Rs. 1,500\nPF Contribution Employee - Rs. 500\nPF Contribution Employer - Rs. 400\nPass necessary Journal Entry for salary to be paid to Mr. A",
    correctFirstEntry: {
      account: "salaries_expense",
      entryType: "debit",
      amount: 30000, // Changed from 30400 to 30000
    },
    correctSecondEntry: {
      account: "salary_payable",
      entryType: "credit",
      amount: 27800, // Salary - PT - TDS - Employee PF
    },
  },
  {
    id: 3,
    scenario:
      "Motor Vehicle purchased on 01/07/2018 worth Rs 80,000 (Depreciation – 25%)\nComputer purchased on 30/09/2018 worth Rs 55,000 (Depreciation – 60%)\nCalculate Depreciation as on 31/03/2019 and Pass necessary Journal Entry.",
    correctFirstEntry: {
      account: "depreciation_expense",
      entryType: "debit",
      amount: 31500, // Changed from 32700 to 31500
    },
    correctSecondEntry: {
      account: "accumulated_depreciation_vehicles", // Changed to be more specific
      entryType: "credit",
      amount: 15000, // Split the credit between vehicles and computers
    },
  },
  {
    id: 4,
    scenario:
      "Machinery purchased for Rs. 6,50,000. Down payment Rs. 2,50,000. Remaining amount was financed by a Hire Purchase Agreement from HDFC. The equated monthly instalment payable for loan repayments is Rs. 10,000 payable over 4 years. Record the journal entry for purchase of machinery & loan.",
    correctFirstEntry: {
      account: "machinery",
      entryType: "debit",
      amount: 650000,
    },
    correctSecondEntry: {
      account: "cash",
      entryType: "credit",
      amount: 250000,
    },
  },
  {
    id: 5,
    scenario:
      "An equipment was purchased for Rs. 15,000. Accumulated depreciation till date on the equipment is Rs. 5,500. This is now sold for 11,000. Record Journal entry.",
    correctFirstEntry: {
      account: "cash",
      entryType: "debit",
      amount: 11000,
    },
    correctSecondEntry: {
      account: "accumulated_depreciation",
      entryType: "debit",
      amount: 5500,
    },
  },
  {
    id: 6,
    scenario:
      "Purchased goods from ABC Corporation for Rs. 50,000. This was however recorded by junior accountant as:\nPurchases Account Dr. Rs. 5,000\nTo ABC Pvt Ltd Account Rs. 5,000\nPass the necessary rectification journal.",
    correctFirstEntry: {
      account: "purchases",
      entryType: "debit",
      amount: 45000,
    },
    correctSecondEntry: {
      account: "abc_corporation", // Changed from accounts_payable to abc_corporation
      entryType: "credit",
      amount: 50000, // Changed from 45000 to 50000
    },
  },
  {
    id: 7,
    scenario:
      "Sold goods worth Rs. 10,000 to Mr. Z for Rs. 12,500 on 20/03/2019. Mr. Z returned half of the goods on 22/03/2019 and sent a debit note for the same. On 28/03/2019 Mr. Z paid Rs. 6,200 in full and final settlement. Pass necessary journal entries.",
    correctFirstEntry: {
      account: "debtors",
      entryType: "debit",
      amount: 12500,
    },
    correctSecondEntry: {
      account: "sales",
      entryType: "credit",
      amount: 12500,
    },
  },
  {
    id: 8,
    scenario:
      "Balance as per passbook for Citibank Current Account # 3259 on 28/02/2019 is Rs. 58,965.20. We noted that there was a cheque of Rs. 15,526 from Z Corp which was deposited in bank but not yet cleared till 28/02/2019. Further we had issued a cheque to Q associates for Rs. 7,800 which hadn't appeared for clearing in our account till 28/02/2019. Calculate the balance of Citibank Current Account # 3259 in the accounts as on 28/02/2019.",
    correctFirstEntry: {
      account: "bank_account",
      entryType: "debit",
      amount: 51239.2, // This is the correct answer: 58965.20 - 15526 + 7800
    },
    correctSecondEntry: {
      account: "bank_account", // This is just a placeholder since we only need one answer
      entryType: "credit",
      amount: 51239.2,
    },
  },
  {
    id: 9,
    scenario:
      "Rs. 1,05,400 got deposited in our Citibank Current Account # 3259 on 31/03/2019 towards maturity of Citibank Fixed Deposit of Rs. 1,00,000. As per the FD maturity advice from bank Rs. 600 had been deducted at source. Pass necessary journal entry.",
    correctFirstEntry: {
      account: "bank_account",
      entryType: "debit",
      amount: 105400,
    },
    correctSecondEntry: {
      account: "fixed_deposit",
      entryType: "credit",
      amount: 100000,
    },
  },
  {
    id: 10,
    scenario:
      "Invoice received on 20/04/2019 from Torrent for electricity supply for the period 01/03/2019 to 15/04/2019 for Rs. 6,300. Our financial year ends on 31/03/2019. Pass the required journal entry for accrual/prepayment as the case may be.",
    correctFirstEntry: {
      account: "electricity_expense",
      entryType: "debit",
      amount: 4725, // 6300 * (31/46) days
    },
    correctSecondEntry: {
      account: "accrued_electricity",
      entryType: "credit",
      amount: 4725,
    },
  },
]
