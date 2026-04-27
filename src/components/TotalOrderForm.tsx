import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useMemo } from 'react';

const schema = Yup.object({
  guaranteeAmount: Yup.number().required('Required').min(1, 'Must be greater than 0').max(999999999, 'Exceeds maximum'),
  currency: Yup.string().required('Required'),
  amountInWords: Yup.string().required('Required').min(5, 'Too short'),
  commissionRate: Yup.number().required('Required').min(0.01, 'Must be > 0').max(10, 'Max 10%'),
  cashMarginPct: Yup.number().required('Required').min(0, 'Cannot be negative').max(100, 'Max 100%'),
  vatRate: Yup.number().required('Required').min(0, 'Cannot be negative').max(25, 'Max 25%'),
  additionalCharges: Yup.number().min(0, 'Cannot be negative').max(999999, 'Exceeds maximum'),
  chargesDescription: Yup.string().max(200, 'Too long'),
});

interface Props { onSubmit: () => void; }

const TotalOrderForm = ({ onSubmit }: Props) => {
  const f = useFormik({
    initialValues: {
      guaranteeAmount: '', currency: '', amountInWords: '', commissionRate: '',
      cashMarginPct: '', vatRate: '15', additionalCharges: '', chargesDescription: '',
    },
    validationSchema: schema,
    onSubmit: (v) => { console.log(v); onSubmit(); },
  });

  const calculated = useMemo(() => {
    const amt = parseFloat(f.values.guaranteeAmount as string) || 0;
    const commRate = parseFloat(f.values.commissionRate as string) || 0;
    const marginPct = parseFloat(f.values.cashMarginPct as string) || 0;
    const vat = parseFloat(f.values.vatRate as string) || 0;
    const extra = parseFloat(f.values.additionalCharges as string) || 0;

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
  }, [f.values.guaranteeAmount, f.values.commissionRate, f.values.cashMarginPct, f.values.vatRate, f.values.additionalCharges]);

  const ic = (fld: string) => {
    const t = f.touched[fld as keyof typeof f.touched], e = f.errors[fld as keyof typeof f.errors];
    const b = 'w-full border rounded-md px-3 py-2.5 text-sm text-text-dark placeholder-text-light focus:outline-none focus:ring-1 transition-colors';
    if (t && e) return `${b} border-red-400 focus:ring-red-400`;
    if (t && !e) return `${b} border-green-400 focus:ring-green-400`;
    return `${b} border-border focus:ring-sidebar-active`;
  };

  const sc = (fld: string) => {
    const t = f.touched[fld as keyof typeof f.touched], e = f.errors[fld as keyof typeof f.errors];
    const b = 'w-full border rounded-md px-3 py-2.5 text-sm bg-white appearance-none cursor-pointer focus:outline-none focus:ring-1 transition-colors';
    if (t && e) return `${b} border-red-400 focus:ring-red-400 text-text-light`;
    if (t && !e && f.values[fld as keyof typeof f.values]) return `${b} border-green-400 focus:ring-green-400 text-text-dark`;
    return `${b} border-border focus:ring-sidebar-active text-text-light`;
  };

  const em = (fld: string) => {
    const t = f.touched[fld as keyof typeof f.touched], e = f.errors[fld as keyof typeof f.errors];
    return t && e ? <p className="text-xs text-red-500 mt-1">{e}</p> : null;
  };

  const chev = <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-light pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>;

  const curr = f.values.currency || 'SAR';

  return (
    <form onSubmit={f.handleSubmit} noValidate>
      <div className="flex gap-8">
        <div className="w-64 shrink-0">
          <h3 className="text-sm font-semibold text-text-dark mb-1">Guarantee amount</h3>
          <p className="text-xs text-text-light leading-relaxed">Total guarantee amount and currency details</p>
        </div>
        <div className="flex-1 max-w-md flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <div><input id="guaranteeAmount" name="guaranteeAmount" type="number" step="0.01" min="0" placeholder="Guarantee amount" className={ic('guaranteeAmount')} value={f.values.guaranteeAmount} onChange={f.handleChange} onBlur={f.handleBlur} />{em('guaranteeAmount')}</div>
            <div className="relative">
              <select id="currency" name="currency" className={sc('currency')} value={f.values.currency} onChange={f.handleChange} onBlur={f.handleBlur}>
                <option value="">Currency</option><option value="SAR">SAR</option><option value="USD">USD</option><option value="EUR">EUR</option><option value="GBP">GBP</option><option value="AED">AED</option>
              </select>{chev}{em('currency')}
            </div>
          </div>
          <div><input id="amountInWords" name="amountInWords" placeholder="Amount in words" className={ic('amountInWords')} value={f.values.amountInWords} onChange={f.handleChange} onBlur={f.handleBlur} />{em('amountInWords')}</div>
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
            <div><input id="commissionRate" name="commissionRate" type="number" step="0.01" min="0" max="10" placeholder="Commission rate (%)" className={ic('commissionRate')} value={f.values.commissionRate} onChange={f.handleChange} onBlur={f.handleBlur} />{em('commissionRate')}</div>
            <div><input id="cashMarginPct" name="cashMarginPct" type="number" step="0.01" min="0" max="100" placeholder="Cash margin (%)" className={ic('cashMarginPct')} value={f.values.cashMarginPct} onChange={f.handleChange} onBlur={f.handleBlur} />{em('cashMarginPct')}</div>
          </div>
          <div><input id="vatRate" name="vatRate" type="number" step="0.01" min="0" max="25" placeholder="VAT rate (%)" className={ic('vatRate')} value={f.values.vatRate} onChange={f.handleChange} onBlur={f.handleBlur} />{em('vatRate')}</div>
          <div><input id="additionalCharges" name="additionalCharges" type="number" step="0.01" min="0" placeholder={`Additional charges (${curr}) - optional`} className={ic('additionalCharges')} value={f.values.additionalCharges} onChange={f.handleChange} onBlur={f.handleBlur} />{em('additionalCharges')}</div>
          <div><input id="chargesDescription" name="chargesDescription" placeholder="Description of additional charges (optional)" maxLength={200} className={ic('chargesDescription')} value={f.values.chargesDescription} onChange={f.handleChange} onBlur={f.handleBlur} />{em('chargesDescription')}</div>
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
            <div className="flex justify-between text-sm"><span className="text-text-light">Commission amount</span><span className="text-text-dark font-medium">{curr} {calculated.commission}</span></div>
            <div className="flex justify-between text-sm"><span className="text-text-light">Cash margin</span><span className="text-text-dark font-medium">{curr} {calculated.cashMargin}</span></div>
            <div className="flex justify-between text-sm"><span className="text-text-light">VAT amount</span><span className="text-text-dark font-medium">{curr} {calculated.vatAmount}</span></div>
            <div className="border-t border-border my-2" />
            <div className="flex justify-between text-sm font-semibold"><span className="text-text-dark">Total charges</span><span className="text-accent">{curr} {calculated.total}</span></div>
          </div>
        </div>
      </div>
      <div className="flex justify-center gap-4 mt-8">
        <button type="button" onClick={() => f.resetForm()} className="px-8 py-2 text-sm font-medium text-text-dark border border-border rounded-md hover:bg-gray-50 transition-colors cursor-pointer">Clear</button>
        <button type="submit" className="px-8 py-2 text-sm font-medium text-white bg-accent rounded-md hover:bg-orange-500 transition-colors cursor-pointer">Submit Order</button>
      </div>
    </form>
  );
};

export default TotalOrderForm;
