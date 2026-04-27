import { useFormik } from 'formik';
import * as Yup from 'yup';

const crRegex = /^[0-9]{10}$/;
const phoneRegex = /^(\+966|05)[0-9]{8,9}$/;
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const schema = Yup.object({
  beneficiaryName: Yup.string().required('Required').min(3, 'Too short').max(100, 'Too long'),
  beneficiaryCr: Yup.string().required('Required').matches(crRegex, 'Must be 10 digits'),
  beneficiaryPhone: Yup.string().required('Required').matches(phoneRegex, 'Invalid Saudi number'),
  beneficiaryEmail: Yup.string().required('Required').matches(emailRegex, 'Invalid email'),
  beneficiaryAddress: Yup.string().required('Required').min(10, 'Too short').max(250, 'Too long'),
  liabilityType: Yup.string().required('Required'),
  tenderRef: Yup.string().required('Required').max(50, 'Too long'),
  projectName: Yup.string().required('Required').min(3, 'Too short'),
  contractDate: Yup.date().required('Required'),
  contractEndDate: Yup.date().required('Required').min(Yup.ref('contractDate'), 'Must be after start'),
  liabilityPct: Yup.number().required('Required').min(0.01, 'Must be > 0').max(100, 'Max 100%'),
});

interface Props { onSubmit: () => void; }

const BeneficiaryForm = ({ onSubmit }: Props) => {
  const f = useFormik({
    initialValues: {
      beneficiaryName: '', beneficiaryCr: '', beneficiaryPhone: '', beneficiaryEmail: '',
      beneficiaryAddress: '', liabilityType: '', tenderRef: '', projectName: '',
      contractDate: '', contractEndDate: '', liabilityPct: '',
    },
    validationSchema: schema,
    onSubmit: (v) => { console.log(v); onSubmit(); },
  });

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

  return (
    <form onSubmit={f.handleSubmit} noValidate>
      <div className="flex gap-8">
        <div className="w-64 shrink-0">
          <h3 className="text-sm font-semibold text-text-dark mb-1">Beneficiary information</h3>
          <p className="text-xs text-text-light leading-relaxed">Details of the party in whose favor the guarantee is issued</p>
        </div>
        <div className="flex-1 max-w-md flex flex-col gap-3">
          <div><input id="beneficiaryName" name="beneficiaryName" placeholder="Beneficiary name" className={ic('beneficiaryName')} value={f.values.beneficiaryName} onChange={f.handleChange} onBlur={f.handleBlur} />{em('beneficiaryName')}</div>
          <div><input id="beneficiaryCr" name="beneficiaryCr" placeholder="Beneficiary CR Number" maxLength={10} className={ic('beneficiaryCr')} value={f.values.beneficiaryCr} onChange={f.handleChange} onBlur={f.handleBlur} />{em('beneficiaryCr')}</div>
          <div className="grid grid-cols-2 gap-3">
            <div><input id="beneficiaryPhone" name="beneficiaryPhone" type="tel" placeholder="Contact number" className={ic('beneficiaryPhone')} value={f.values.beneficiaryPhone} onChange={f.handleChange} onBlur={f.handleBlur} />{em('beneficiaryPhone')}</div>
            <div><input id="beneficiaryEmail" name="beneficiaryEmail" type="email" placeholder="Email" className={ic('beneficiaryEmail')} value={f.values.beneficiaryEmail} onChange={f.handleChange} onBlur={f.handleBlur} />{em('beneficiaryEmail')}</div>
          </div>
          <div>
            <textarea id="beneficiaryAddress" name="beneficiaryAddress" placeholder="Full beneficiary address" rows={3} maxLength={250} className={`${ic('beneficiaryAddress')} resize-none`} value={f.values.beneficiaryAddress} onChange={f.handleChange} onBlur={f.handleBlur} />
            <div className="flex justify-between mt-1">{em('beneficiaryAddress') || <span />}<span className="text-xs text-text-light">{f.values.beneficiaryAddress.length}/250</span></div>
          </div>
        </div>
      </div>
      <div className="my-6" />
      <div className="flex gap-8">
        <div className="w-64 shrink-0">
          <h3 className="text-sm font-semibold text-text-dark mb-1">Liability details</h3>
          <p className="text-xs text-text-light leading-relaxed">Contract and liability information</p>
        </div>
        <div className="flex-1 max-w-md flex flex-col gap-3">
          <div className="relative">
            <select id="liabilityType" name="liabilityType" className={sc('liabilityType')} value={f.values.liabilityType} onChange={f.handleChange} onBlur={f.handleBlur}>
              <option value="">Liability type</option><option value="direct">Direct</option><option value="indirect">Indirect</option><option value="contingent">Contingent</option><option value="joint">Joint</option>
            </select>{chev}{em('liabilityType')}
          </div>
          <div><input id="projectName" name="projectName" placeholder="Project name" className={ic('projectName')} value={f.values.projectName} onChange={f.handleChange} onBlur={f.handleBlur} />{em('projectName')}</div>
          <div><input id="tenderRef" name="tenderRef" placeholder="Tender / Contract reference" maxLength={50} className={ic('tenderRef')} value={f.values.tenderRef} onChange={f.handleChange} onBlur={f.handleBlur} />{em('tenderRef')}</div>
          <div className="grid grid-cols-2 gap-3">
            <div><label htmlFor="contractDate" className="block text-xs text-text-light mb-1">Contract date</label><input id="contractDate" name="contractDate" type="date" className={ic('contractDate')} value={f.values.contractDate} onChange={f.handleChange} onBlur={f.handleBlur} />{em('contractDate')}</div>
            <div><label htmlFor="contractEndDate" className="block text-xs text-text-light mb-1">End date</label><input id="contractEndDate" name="contractEndDate" type="date" className={ic('contractEndDate')} value={f.values.contractEndDate} onChange={f.handleChange} onBlur={f.handleBlur} />{em('contractEndDate')}</div>
          </div>
          <div><input id="liabilityPct" name="liabilityPct" type="number" step="0.01" min="0" max="100" placeholder="Liability percentage (%)" className={ic('liabilityPct')} value={f.values.liabilityPct} onChange={f.handleChange} onBlur={f.handleBlur} />{em('liabilityPct')}</div>
        </div>
      </div>
      <div className="flex justify-center gap-4 mt-8">
        <button type="button" onClick={() => f.resetForm()} className="px-8 py-2 text-sm font-medium text-text-dark border border-border rounded-md hover:bg-gray-50 transition-colors cursor-pointer">Clear</button>
        <button type="submit" className="px-8 py-2 text-sm font-medium text-white bg-accent rounded-md hover:bg-orange-500 transition-colors cursor-pointer">Save & Continue</button>
      </div>
    </form>
  );
};

export default BeneficiaryForm;
