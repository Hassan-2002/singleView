import { useFormik } from 'formik';
import * as Yup from 'yup';

const ibanRegex = /^SA[0-9]{22}$/;
const accountRegex = /^[0-9]{10,16}$/;

const validationSchema = Yup.object({
  guaranteeType: Yup.string().required('Select a guarantee type'),
  guaranteePurpose: Yup.string()
    .required('Purpose is required')
    .min(10, 'Provide more detail about the purpose')
    .max(200, 'Cannot exceed 200 characters'),
  bankName: Yup.string().required('Select a bank'),
  branch: Yup.string().required('Select a branch'),
  accountNumber: Yup.string()
    .required('Account number is required')
    .matches(accountRegex, 'Enter a valid account number (10-16 digits)'),
  iban: Yup.string()
    .required('IBAN is required')
    .matches(ibanRegex, 'Enter a valid Saudi IBAN (SA followed by 22 digits)'),
  issueDate: Yup.date()
    .required('Issue date is required')
    .min(new Date(), 'Issue date cannot be in the past'),
  expiryDate: Yup.date()
    .required('Expiry date is required')
    .min(Yup.ref('issueDate'), 'Expiry date must be after issue date'),
  currency: Yup.string().required('Select a currency'),
  guaranteeRefNumber: Yup.string()
    .max(30, 'Reference number is too long'),
});

interface BankGuaranteeFormProps {
  onSubmit: () => void;
}

const BankGuaranteeForm = ({ onSubmit }: BankGuaranteeFormProps) => {
  const formik = useFormik({
    initialValues: {
      guaranteeType: '',
      guaranteePurpose: '',
      bankName: '',
      branch: '',
      accountNumber: '',
      iban: '',
      issueDate: '',
      expiryDate: '',
      currency: '',
      guaranteeRefNumber: '',
    },
    validationSchema,
    onSubmit: (values) => {
      console.log(values);
      onSubmit();
    },
  });

  const inputClass = (field: string) => {
    const touched = formik.touched[field as keyof typeof formik.touched];
    const error = formik.errors[field as keyof typeof formik.errors];
    const base = 'w-full border rounded-md px-3 py-2.5 text-sm text-text-dark placeholder-text-light focus:outline-none focus:ring-1 transition-colors';
    if (touched && error) return `${base} border-red-400 focus:ring-red-400 focus:border-red-400`;
    if (touched && !error) return `${base} border-green-400 focus:ring-green-400 focus:border-green-400`;
    return `${base} border-border focus:ring-sidebar-active focus:border-sidebar-active`;
  };

  const selectClass = (field: string) => {
    const touched = formik.touched[field as keyof typeof formik.touched];
    const error = formik.errors[field as keyof typeof formik.errors];
    const base = 'w-full border rounded-md px-3 py-2.5 text-sm bg-white appearance-none cursor-pointer focus:outline-none focus:ring-1 transition-colors';
    if (touched && error) return `${base} border-red-400 focus:ring-red-400 focus:border-red-400 text-text-light`;
    if (touched && !error && formik.values[field as keyof typeof formik.values]) return `${base} border-green-400 focus:ring-green-400 focus:border-green-400 text-text-dark`;
    return `${base} border-border focus:ring-sidebar-active focus:border-sidebar-active text-text-light`;
  };

  const errorMsg = (field: string) => {
    const touched = formik.touched[field as keyof typeof formik.touched];
    const error = formik.errors[field as keyof typeof formik.errors];
    if (touched && error) return <p className="text-xs text-red-500 mt-1">{error}</p>;
    return null;
  };

  const chevron = (
    <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-light pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );

  return (
    <form onSubmit={formik.handleSubmit} noValidate>
      <div className="flex gap-8">
        <div className="w-64 shrink-0">
          <h3 className="text-sm font-semibold text-text-dark mb-1">Guarantee information</h3>
          <p className="text-xs text-text-light leading-relaxed">
            Provide the type and purpose of the letter of guarantee
          </p>
        </div>

        <div className="flex-1 max-w-md flex flex-col gap-3">
          <div className="relative">
            <select
              id="guaranteeType"
              name="guaranteeType"
              className={selectClass('guaranteeType')}
              value={formik.values.guaranteeType}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              <option value="">Guarantee type</option>
              <option value="bid_bond">Bid Bond</option>
              <option value="performance">Performance Bond</option>
              <option value="advance_payment">Advance Payment Guarantee</option>
              <option value="retention">Retention Guarantee</option>
              <option value="financial">Financial Guarantee</option>
            </select>
            {chevron}
            {errorMsg('guaranteeType')}
          </div>

          <div>
            <textarea
              id="guaranteePurpose"
              name="guaranteePurpose"
              placeholder="Purpose of guarantee"
              rows={3}
              maxLength={200}
              className={`${inputClass('guaranteePurpose')} resize-none`}
              value={formik.values.guaranteePurpose}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <div className="flex justify-between items-center mt-1">
              {errorMsg('guaranteePurpose') || <span />}
              <span className="text-xs text-text-light">{formik.values.guaranteePurpose.length}/200</span>
            </div>
          </div>

          <div>
            <input
              id="guaranteeRefNumber"
              name="guaranteeRefNumber"
              type="text"
              placeholder="Guarantee reference number (optional)"
              maxLength={30}
              className={inputClass('guaranteeRefNumber')}
              value={formik.values.guaranteeRefNumber}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {errorMsg('guaranteeRefNumber')}
          </div>
        </div>
      </div>

      <div className="my-6"></div>

      <div className="flex gap-8">
        <div className="w-64 shrink-0">
          <h3 className="text-sm font-semibold text-text-dark mb-1">Bank & account details</h3>
          <p className="text-xs text-text-light leading-relaxed">
            Select the issuing bank and provide account information
          </p>
        </div>

        <div className="flex-1 max-w-md flex flex-col gap-3">
          <div className="relative">
            <select
              id="bankName"
              name="bankName"
              className={selectClass('bankName')}
              value={formik.values.bankName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              <option value="">Bank name</option>
              <option value="snb">Saudi National Bank (SNB)</option>
              <option value="alrajhi">Al Rajhi Bank</option>
              <option value="riyad">Riyad Bank</option>
              <option value="sab">Saudi Awwal Bank (SAB)</option>
              <option value="anb">Arab National Bank</option>
              <option value="bsf">Banque Saudi Fransi</option>
            </select>
            {chevron}
            {errorMsg('bankName')}
          </div>

          <div className="relative">
            <select
              id="branch"
              name="branch"
              className={selectClass('branch')}
              value={formik.values.branch}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              <option value="">Branch</option>
              <option value="main">Main Branch - Riyadh</option>
              <option value="jeddah">Jeddah Branch</option>
              <option value="dammam">Dammam Branch</option>
              <option value="makkah">Makkah Branch</option>
              <option value="madinah">Madinah Branch</option>
            </select>
            {chevron}
            {errorMsg('branch')}
          </div>

          <div>
            <input
              id="accountNumber"
              name="accountNumber"
              type="text"
              placeholder="Account number"
              maxLength={16}
              className={inputClass('accountNumber')}
              value={formik.values.accountNumber}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {errorMsg('accountNumber')}
          </div>

          <div>
            <input
              id="iban"
              name="iban"
              type="text"
              placeholder="IBAN (e.g. SA0000000000000000000000)"
              maxLength={24}
              className={inputClass('iban')}
              value={formik.values.iban}
              onChange={(e) => formik.setFieldValue('iban', e.target.value.toUpperCase())}
              onBlur={formik.handleBlur}
            />
            {errorMsg('iban')}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="issueDate" className="block text-xs text-text-light mb-1">Issue date</label>
              <input
                id="issueDate"
                name="issueDate"
                type="date"
                className={inputClass('issueDate')}
                value={formik.values.issueDate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {errorMsg('issueDate')}
            </div>
            <div>
              <label htmlFor="expiryDate" className="block text-xs text-text-light mb-1">Expiry date</label>
              <input
                id="expiryDate"
                name="expiryDate"
                type="date"
                className={inputClass('expiryDate')}
                value={formik.values.expiryDate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {errorMsg('expiryDate')}
            </div>
          </div>

          <div className="relative">
            <select
              id="currency"
              name="currency"
              className={selectClass('currency')}
              value={formik.values.currency}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              <option value="">Currency</option>
              <option value="SAR">SAR - Saudi Riyal</option>
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
              <option value="AED">AED - Emirati Dirham</option>
            </select>
            {chevron}
            {errorMsg('currency')}
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-4 mt-8">
        <button
          type="button"
          onClick={() => formik.resetForm()}
          className="px-8 py-2 text-sm font-medium text-text-dark border border-border rounded-md hover:bg-gray-50 transition-colors cursor-pointer"
        >
          Clear
        </button>
        <button
          type="submit"
          className="px-8 py-2 text-sm font-medium text-white bg-accent rounded-md hover:bg-orange-500 transition-colors cursor-pointer"
        >
          Save & Continue
        </button>
      </div>
    </form>
  );
};

export default BankGuaranteeForm;
