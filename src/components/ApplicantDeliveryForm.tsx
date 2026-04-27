import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';

const crNumberRegex = /^[0-9]{10}$/;
const postalCodeRegex = /^[0-9]{5}$/;
const phoneRegex = /^(\+966|05)[0-9]{8,9}$/;
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const buildingRegex = /^[0-9]{1,6}$/;

const validationSchema = Yup.object({
  name: Yup.string()
    .required('Name is required')
    .min(3, 'Name must be at least 3 characters')
    .max(100, 'Name cannot exceed 100 characters'),
  crNumber: Yup.string()
    .required('CR Number is required')
    .matches(crNumberRegex, 'CR Number must be exactly 10 digits'),
  contactNumber: Yup.string()
    .required('Contact number is required')
    .matches(phoneRegex, 'Enter a valid Saudi phone number'),
  email: Yup.string()
    .required('Email is required')
    .matches(emailRegex, 'Enter a valid email address'),
  deliveryOfOriginalGuarantee: Yup.string()
    .required('Select delivery method'),
  deliveryTo: Yup.string()
    .required('Select delivery recipient'),
  addressType: Yup.string()
    .required('Select address type'),
  shortAddress: Yup.string()
    .required('Short address is required')
    .min(4, 'Short address is too short')
    .max(8, 'Short address cannot exceed 8 characters'),
  buildingNumber: Yup.string()
    .required('Building number is required')
    .matches(buildingRegex, 'Enter a valid building number'),
  unitNumber: Yup.string()
    .required('Unit number is required')
    .matches(buildingRegex, 'Enter a valid unit number'),
  streetName: Yup.string()
    .required('Street name is required')
    .min(2, 'Street name is too short')
    .max(80, 'Street name is too long'),
  secondaryNumber: Yup.string()
    .required('Secondary number is required')
    .matches(/^[0-9]{1,6}$/, 'Enter a valid secondary number'),
  country: Yup.string()
    .required('Select a country'),
  district: Yup.string()
    .required('District is required')
    .min(2, 'District name is too short'),
  city: Yup.string()
    .required('City is required')
    .min(2, 'City name is too short'),
  postalCode: Yup.string()
    .required('Postal code is required')
    .matches(postalCodeRegex, 'Postal code must be exactly 5 digits'),
  poBox: Yup.string()
    .matches(/^[0-9]{1,8}$/, 'Enter a valid PO Box number'),
  additionalInfo: Yup.string()
    .max(250, 'Cannot exceed 250 characters'),
});

interface ApplicantDeliveryFormProps { onSubmit: () => void; }

const ApplicantDeliveryForm = ({ onSubmit }: ApplicantDeliveryFormProps) => {
  const [crValidated, setCrValidated] = useState(false);
  const [crValidating, setCrValidating] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: '',
      crNumber: '',
      contactNumber: '',
      email: '',
      deliveryOfOriginalGuarantee: '',
      deliveryTo: '',
      addressType: '',
      shortAddress: '',
      buildingNumber: '',
      unitNumber: '',
      streetName: '',
      secondaryNumber: '',
      country: '',
      district: '',
      city: '',
      postalCode: '',
      poBox: '',
      additionalInfo: '',
    },
    validationSchema,
    onSubmit: (values) => {
      if (!crValidated) {
        formik.setFieldError('crNumber', 'Please validate the CR Number first');
        return;
      }
      console.log(values);
      onSubmit();
    },
  });

  const handleCrValidation = async () => {
    const crError = await formik.validateField('crNumber');
    formik.setFieldTouched('crNumber', true);

    if (crError || formik.errors.crNumber) return;

    setCrValidating(true);
    setTimeout(() => {
      setCrValidating(false);
      setCrValidated(true);
    }, 1200);
  };

  const handleClear = () => {
    formik.resetForm();
    setCrValidated(false);
  };

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
          <h3 className="text-sm font-semibold text-text-dark mb-1">Applicant details</h3>
          <p className="text-xs text-text-light leading-relaxed">
            Enter CR Number to validate company and letter request
          </p>
        </div>

        <div className="flex-1 max-w-md flex flex-col gap-3">
          <div>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Name"
              className={inputClass('name')}
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {errorMsg('name')}
          </div>

          <div className="flex items-start gap-0">
            <div className="flex-1">
              <div className="relative">
                <input
                  id="crNumber"
                  name="crNumber"
                  type="text"
                  placeholder="CR Number"
                  maxLength={10}
                  className={`${inputClass('crNumber')} rounded-r-none border-r-0`}
                  value={formik.values.crNumber}
                  onChange={(e) => {
                    setCrValidated(false);
                    formik.handleChange(e);
                  }}
                  onBlur={formik.handleBlur}
                />
              </div>
              {errorMsg('crNumber')}
              {crValidated && <p className="text-xs text-green-600 mt-1">CR Number verified successfully</p>}
            </div>
            <button
              type="button"
              onClick={handleCrValidation}
              disabled={crValidating}
              className={`px-4 py-2.5 text-sm font-medium border border-border rounded-r-md transition-colors cursor-pointer whitespace-nowrap
                ${crValidated
                  ? 'text-green-600 bg-green-50'
                  : crValidating
                    ? 'text-text-light bg-gray-50 cursor-wait'
                    : 'text-accent hover:bg-accent-light'
                }`}
            >
              {crValidating ? 'Validating...' : crValidated ? 'Verified ✓' : 'Validate'}
            </button>
          </div>

          <div>
            <input
              id="contactNumber"
              name="contactNumber"
              type="tel"
              placeholder="Contact number (e.g. +966XXXXXXXXX)"
              className={inputClass('contactNumber')}
              value={formik.values.contactNumber}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {errorMsg('contactNumber')}
          </div>

          <div>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Email address"
              className={inputClass('email')}
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {errorMsg('email')}
          </div>
        </div>
      </div>

      <div className="my-6"></div>

      <div className="flex gap-8">
        <div className="w-64 shrink-0">
          <h3 className="text-sm font-semibold text-text-dark">Applicant & delivery address</h3>
        </div>

        <div className="flex-1 max-w-md flex flex-col gap-3">
          <div className="relative">
            <select
              id="deliveryOfOriginalGuarantee"
              name="deliveryOfOriginalGuarantee"
              className={selectClass('deliveryOfOriginalGuarantee')}
              value={formik.values.deliveryOfOriginalGuarantee}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              <option value="">Delivery of Original Guarantee</option>
              <option value="branch">Branch Pickup</option>
              <option value="courier">Courier Delivery</option>
              <option value="registered_mail">Registered Mail</option>
            </select>
            {chevron}
            {errorMsg('deliveryOfOriginalGuarantee')}
          </div>

          <div className="relative">
            <select
              id="deliveryTo"
              name="deliveryTo"
              className={selectClass('deliveryTo')}
              value={formik.values.deliveryTo}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              <option value="">Delivery to</option>
              <option value="applicant">Applicant</option>
              <option value="beneficiary">Beneficiary</option>
              <option value="third_party">Third Party</option>
            </select>
            {chevron}
            {errorMsg('deliveryTo')}
          </div>

          <div className="relative">
            <select
              id="addressType"
              name="addressType"
              className={selectClass('addressType')}
              value={formik.values.addressType}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              <option value="">Address type</option>
              <option value="national">National Address</option>
              <option value="international">International Address</option>
              <option value="po_box">PO Box</option>
            </select>
            {chevron}
            {errorMsg('addressType')}
          </div>

          <div>
            <input
              id="shortAddress"
              name="shortAddress"
              type="text"
              placeholder="Short address"
              maxLength={8}
              className={inputClass('shortAddress')}
              value={formik.values.shortAddress}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {errorMsg('shortAddress')}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <input
                id="buildingNumber"
                name="buildingNumber"
                type="text"
                placeholder="Building number"
                className={inputClass('buildingNumber')}
                value={formik.values.buildingNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {errorMsg('buildingNumber')}
            </div>
            <div>
              <input
                id="unitNumber"
                name="unitNumber"
                type="text"
                placeholder="Unit number"
                className={inputClass('unitNumber')}
                value={formik.values.unitNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {errorMsg('unitNumber')}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <input
                id="streetName"
                name="streetName"
                type="text"
                placeholder="Street name"
                className={inputClass('streetName')}
                value={formik.values.streetName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {errorMsg('streetName')}
            </div>
            <div>
              <input
                id="secondaryNumber"
                name="secondaryNumber"
                type="text"
                placeholder="Secondary number"
                className={inputClass('secondaryNumber')}
                value={formik.values.secondaryNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {errorMsg('secondaryNumber')}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <select
                id="country"
                name="country"
                className={selectClass('country')}
                value={formik.values.country}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <option value="">Country</option>
                <option value="sa">Saudi Arabia</option>
                <option value="ae">United Arab Emirates</option>
                <option value="kw">Kuwait</option>
                <option value="bh">Bahrain</option>
                <option value="om">Oman</option>
                <option value="qa">Qatar</option>
              </select>
              {chevron}
              {errorMsg('country')}
            </div>
            <div>
              <input
                id="district"
                name="district"
                type="text"
                placeholder="District"
                className={inputClass('district')}
                value={formik.values.district}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {errorMsg('district')}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <input
                id="city"
                name="city"
                type="text"
                placeholder="City"
                className={inputClass('city')}
                value={formik.values.city}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {errorMsg('city')}
            </div>
            <div>
              <input
                id="postalCode"
                name="postalCode"
                type="text"
                placeholder="Postal code"
                maxLength={5}
                className={inputClass('postalCode')}
                value={formik.values.postalCode}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {errorMsg('postalCode')}
            </div>
          </div>

          <div>
            <input
              id="poBox"
              name="poBox"
              type="text"
              placeholder="PO Box (optional)"
              className={inputClass('poBox')}
              value={formik.values.poBox}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {errorMsg('poBox')}
          </div>

          <div>
            <textarea
              id="additionalInfo"
              name="additionalInfo"
              placeholder="Additional delivery instructions (optional)"
              rows={3}
              maxLength={250}
              className={`${inputClass('additionalInfo')} resize-none`}
              value={formik.values.additionalInfo}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <div className="flex justify-between items-center mt-1">
              {errorMsg('additionalInfo') || <span />}
              <span className="text-xs text-text-light">{formik.values.additionalInfo.length}/250</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-6">
        <a href="#" className="text-sm text-link-blue hover:underline">
          Applicant address is Different ?
        </a>
      </div>

      <div className="flex justify-center gap-4 mt-6">
        <button
          type="button"
          onClick={handleClear}
          className="px-8 py-2 text-sm font-medium text-text-dark border border-border rounded-md hover:bg-gray-50 transition-colors cursor-pointer"
        >
          Clear
        </button>
        <button
          type="submit"
          className="px-8 py-2 text-sm font-medium text-white bg-accent rounded-md hover:bg-orange-500 transition-colors cursor-pointer"
        >
          Next
        </button>
      </div>
    </form>
  );
};

export default ApplicantDeliveryForm;
