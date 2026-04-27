import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useMemo } from 'react';

const validationSchema = Yup.object({
  guaranteeAmount: Yup.number().required('Required').min(1, 'Must be greater than 0').max(999999999, 'Exceeds maximum'),
  currency: Yup.string().required('Required'),
  amountInWords: Yup.string().required('Required').min(5, 'Too short'),
  commissionRate: Yup.number().required('Required').min(0.01, 'Must be > 0').max(10, 'Max 10%'),
  cashMarginPct: Yup.number().required('Required').min(0, 'Cannot be negative').max(100, 'Max 100%'),
  vatRate: Yup.number().required('Required').min(0, 'Cannot be negative').max(25, 'Max 25%'),
  additionalCharges: Yup.number().min(0, 'Cannot be negative').max(999999, 'Exceeds maximum'),
  chargesDescription: Yup.string().max(200, 'Too long'),
});

interface TotalOrderFormProps {
  onSubmit: () => void;
}

const TotalOrderForm = ({ onSubmit }: TotalOrderFormProps) => {
  const formik = useFormik({
    initialValues: {
      guaranteeAmount: '',
      currency: '',
      amountInWords: '',
      commissionRate: '',
      cashMarginPct: '',
      vatRate: '15',
      additionalCharges: '',
      chargesDescription: '',
    },
    validationSchema,
    onSubmit: (values) => {
      console.log(values);
      onSubmit();
    },
  });

  const calculated = useMemo(() => {
    const amt = parseFloat(formik.values.guaranteeAmount as string) || 0;
    const commRate = parseFloat(formik.values.commissionRate as string) || 0;
    const marginPct = parseFloat(formik.values.cashMarginPct as string) || 0;
    const vat = parseFloat(formik.values.vatRate as string) || 0;
    const extra = parseFloat(formik.values.additionalCharges as string) || 0;

    const commission = amt * (commRate / 100);
    const cashMargin = amt * (marginPct / 100);
    const vatAmount = commission * (vat / 100);
    const total = commission + vatAmount + extra;

    return {
      commission: commission.toFixed(2),
      cashMargin: cashMargin.toFixed(2),
      vatAmount: vatAmount.toFixed(2),
      total: total.toFixed(2),
    };
  }, [formik.values.guaranteeAmount, formik.values.commissionRate, formik.values.cashMarginPct, formik.values.vatRate, formik.values.additionalCharges]);

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
    return touched && error ? <p className="text-xs text-red-500 mt-1">{error}</p> : null;
  };

  const chevron = (
    <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-light pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );

  const curr = formik.values.currency || 'SAR';

  return (
    <form onSubmit={formik.handleSubmit} noValidate>
      <div className="flex gap-8">
        <div className="w-64 shrink-0">
          <h3 className="text-sm font-semibold text-text-dark mb-1">Guarantee amount</h3>
          <p className="text-xs text-text-light leading-relaxed">Total guarantee amount and currency details</p>
        </div>
        <div className="flex-1 max-w-md flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <input id="guaranteeAmount" name="guaranteeAmount" type="number" step="0.01" min="0" placeholder="Guarantee amount" className={inputClass('guaranteeAmount')} value={formik.values.guaranteeAmount} onChange={formik.handleChange} onBlur={formik.handleBlur} />
              {errorMsg('guaranteeAmount')}
            </div>
            <div className="relative">
              <select id="currency" name="currency" className={selectClass('currency')} value={formik.values.currency} onChange={formik.handleChange} onBlur={formik.handleBlur}>
                <option value="">Currency</option>
                <option value="SAR">SAR</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="AED">AED</option>
              </select>
              {chevron}
              {errorMsg('currency')}
            </div>
          </div>
          <div>
            <input id="amountInWords" name="amountInWords" placeholder="Amount in words" className={inputClass('amountInWords')} value={formik.values.amountInWords} onChange={formik.handleChange} onBlur={formik.handleBlur} />
            {errorMsg('amountInWords')}
          </div>
        </div>
      </div>

      <div className="my-6" />

      <div className="flex gap-8">
        <div className="w-64 shrink-0">
          <h3 className="text-sm font-semibold text-text-dark mb-1">Commission & charges</h3>
          <p className="text-xs text-text-light leading-relaxed">Rates and charges applied to the guarantee</p>
        </div>
        <div className="flex-1 max-w-md flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <input id="commissionRate" name="commissionRate" type="number" step="0.01" min="0" max="10" placeholder="Commission rate (%)" className={inputClass('commissionRate')} value={formik.values.commissionRate} onChange={formik.handleChange} onBlur={formik.handleBlur} />
              {errorMsg('commissionRate')}
            </div>
            <div>
              <input id="cashMarginPct" name="cashMarginPct" type="number" step="0.01" min="0" max="100" placeholder="Cash margin (%)" className={inputClass('cashMarginPct')} value={formik.values.cashMarginPct} onChange={formik.handleChange} onBlur={formik.handleBlur} />
              {errorMsg('cashMarginPct')}
            </div>
          </div>
          <div>
            <input id="vatRate" name="vatRate" type="number" step="0.01" min="0" max="25" placeholder="VAT rate (%)" className={inputClass('vatRate')} value={formik.values.vatRate} onChange={formik.handleChange} onBlur={formik.handleBlur} />
            {errorMsg('vatRate')}
          </div>
          <div>
            <input id="additionalCharges" name="additionalCharges" type="number" step="0.01" min="0" placeholder={`Additional charges (${curr}) - optional`} className={inputClass('additionalCharges')} value={formik.values.additionalCharges} onChange={formik.handleChange} onBlur={formik.handleBlur} />
            {errorMsg('additionalCharges')}
          </div>
          <div>
            <input id="chargesDescription" name="chargesDescription" placeholder="Description of additional charges (optional)" maxLength={200} className={inputClass('chargesDescription')} value={formik.values.chargesDescription} onChange={formik.handleChange} onBlur={formik.handleBlur} />
            {errorMsg('chargesDescription')}
          </div>
        </div>
      </div>

      <div className="my-6" />

      <div className="flex gap-8">
        <div className="w-64 shrink-0">
          <h3 className="text-sm font-semibold text-text-dark mb-1">Order summary</h3>
          <p className="text-xs text-text-light leading-relaxed">Auto-calculated based on the values above</p>
        </div>
        <div className="flex-1 max-w-md">
          <div className="bg-bg rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-text-light">Commission amount</span>
              <span className="text-text-dark font-medium">{curr} {calculated.commission}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-light">Cash margin</span>
              <span className="text-text-dark font-medium">{curr} {calculated.cashMargin}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-light">VAT amount</span>
              <span className="text-text-dark font-medium">{curr} {calculated.vatAmount}</span>
            </div>
            <div className="border-t border-border my-2" />
            <div className="flex justify-between text-sm font-semibold">
              <span className="text-text-dark">Total charges</span>
              <span className="text-accent">{curr} {calculated.total}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-4 mt-8">
        <button type="button" onClick={() => formik.resetForm()} className="px-8 py-2 text-sm font-medium text-text-dark border border-border rounded-md hover:bg-gray-50 transition-colors cursor-pointer">Clear</button>
        <button type="submit" className="px-8 py-2 text-sm font-medium text-white bg-accent rounded-md hover:bg-orange-500 transition-colors cursor-pointer">Submit Order</button>
      </div>
    </form>
  );
};

export default TotalOrderForm;
