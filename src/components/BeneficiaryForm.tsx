import { useFormik } from 'formik';
import * as Yup from 'yup';

const crRegex = /^[0-9]{10}$/;
const phoneRegex = /^(\+966|05)[0-9]{8,9}$/;
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const validationSchema = Yup.object({
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

interface BeneficiaryFormProps {
  onSubmit: () => void;
}

const BeneficiaryForm = ({ onSubmit }: BeneficiaryFormProps) => {
  const formik = useFormik({
    initialValues: {
      beneficiaryName: '',
      beneficiaryCr: '',
      beneficiaryPhone: '',
      beneficiaryEmail: '',
      beneficiaryAddress: '',
      liabilityType: '',
      tenderRef: '',
      projectName: '',
      contractDate: '',
      contractEndDate: '',
      liabilityPct: '',
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
    return touched && error ? <p className="text-xs text-red-500 mt-1">{error}</p> : null;
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
          <h3 className="text-sm font-semibold text-text-dark mb-1">Beneficiary information</h3>
          <p className="text-xs text-text-light leading-relaxed">Details of the party in whose favor the guarantee is issued</p>
        </div>
        <div className="flex-1 max-w-md flex flex-col gap-3">
          <div>
            <input id="beneficiaryName" name="beneficiaryName" placeholder="Beneficiary name" className={inputClass('beneficiaryName')} value={formik.values.beneficiaryName} onChange={formik.handleChange} onBlur={formik.handleBlur} />
            {errorMsg('beneficiaryName')}
          </div>
          <div>
            <input id="beneficiaryCr" name="beneficiaryCr" placeholder="Beneficiary CR Number" maxLength={10} className={inputClass('beneficiaryCr')} value={formik.values.beneficiaryCr} onChange={formik.handleChange} onBlur={formik.handleBlur} />
            {errorMsg('beneficiaryCr')}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <input id="beneficiaryPhone" name="beneficiaryPhone" type="tel" placeholder="Contact number" className={inputClass('beneficiaryPhone')} value={formik.values.beneficiaryPhone} onChange={formik.handleChange} onBlur={formik.handleBlur} />
              {errorMsg('beneficiaryPhone')}
            </div>
            <div>
              <input id="beneficiaryEmail" name="beneficiaryEmail" type="email" placeholder="Email" className={inputClass('beneficiaryEmail')} value={formik.values.beneficiaryEmail} onChange={formik.handleChange} onBlur={formik.handleBlur} />
              {errorMsg('beneficiaryEmail')}
            </div>
          </div>
          <div>
            <textarea id="beneficiaryAddress" name="beneficiaryAddress" placeholder="Full beneficiary address" rows={3} maxLength={250} className={`${inputClass('beneficiaryAddress')} resize-none`} value={formik.values.beneficiaryAddress} onChange={formik.handleChange} onBlur={formik.handleBlur} />
            <div className="flex justify-between mt-1">
              {errorMsg('beneficiaryAddress') || <span />}
              <span className="text-xs text-text-light">{formik.values.beneficiaryAddress.length}/250</span>
            </div>
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
            <select id="liabilityType" name="liabilityType" className={selectClass('liabilityType')} value={formik.values.liabilityType} onChange={formik.handleChange} onBlur={formik.handleBlur}>
              <option value="">Liability type</option>
              <option value="direct">Direct</option>
              <option value="indirect">Indirect</option>
              <option value="contingent">Contingent</option>
              <option value="joint">Joint</option>
            </select>
            {chevron}
            {errorMsg('liabilityType')}
          </div>
          <div>
            <input id="projectName" name="projectName" placeholder="Project name" className={inputClass('projectName')} value={formik.values.projectName} onChange={formik.handleChange} onBlur={formik.handleBlur} />
            {errorMsg('projectName')}
          </div>
          <div>
            <input id="tenderRef" name="tenderRef" placeholder="Tender / Contract reference" maxLength={50} className={inputClass('tenderRef')} value={formik.values.tenderRef} onChange={formik.handleChange} onBlur={formik.handleBlur} />
            {errorMsg('tenderRef')}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="contractDate" className="block text-xs text-text-light mb-1">Contract date</label>
              <input id="contractDate" name="contractDate" type="date" className={inputClass('contractDate')} value={formik.values.contractDate} onChange={formik.handleChange} onBlur={formik.handleBlur} />
              {errorMsg('contractDate')}
            </div>
            <div>
              <label htmlFor="contractEndDate" className="block text-xs text-text-light mb-1">End date</label>
              <input id="contractEndDate" name="contractEndDate" type="date" className={inputClass('contractEndDate')} value={formik.values.contractEndDate} onChange={formik.handleChange} onBlur={formik.handleBlur} />
              {errorMsg('contractEndDate')}
            </div>
          </div>
          <div>
            <input id="liabilityPct" name="liabilityPct" type="number" step="0.01" min="0" max="100" placeholder="Liability percentage (%)" className={inputClass('liabilityPct')} value={formik.values.liabilityPct} onChange={formik.handleChange} onBlur={formik.handleBlur} />
            {errorMsg('liabilityPct')}
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-4 mt-8">
        <button type="button" onClick={() => formik.resetForm()} className="px-8 py-2 text-sm font-medium text-text-dark border border-border rounded-md hover:bg-gray-50 transition-colors cursor-pointer">Clear</button>
        <button type="submit" className="px-8 py-2 text-sm font-medium text-white bg-accent rounded-md hover:bg-orange-500 transition-colors cursor-pointer">Save & Continue</button>
      </div>
    </form>
  );
};

export default BeneficiaryForm;
