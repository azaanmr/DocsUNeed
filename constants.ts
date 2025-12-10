import { Service } from './types';

export const INITIAL_SERVICES: Service[] = [
  {
    id: 'service-voter',
    name: 'Voter ID Services',
    iconName: 'Vote',
    sections: [
      {
        id: 'sec-voter-age',
        title: 'Proof of Date of Birth',
        description: 'Mandatory for new applications. One required.',
        iconName: 'Calendar',
        items: [
          { id: 'item-birth-cert', name: 'Birth Certificate', isMandatory: true, isOfflineOnly: false },
          { id: 'item-aadhar', name: 'Aadhaar Card', isMandatory: true, isOfflineOnly: false },
          { id: 'item-pan', name: 'PAN Card', isMandatory: true, isOfflineOnly: false },
          { id: 'item-10th', name: 'Class 10th Marksheet', isMandatory: true, isOfflineOnly: false },
          { id: 'item-passport', name: 'Indian Passport', isMandatory: true, isOfflineOnly: false },
        ],
      },
      {
        id: 'sec-voter-addr',
        title: 'Proof of Address',
        description: 'Must show current residence. One required.',
        iconName: 'MapPin',
        items: [
          { id: 'item-addr-aadhar', name: 'Aadhaar Card', isMandatory: true, isOfflineOnly: false },
          { id: 'item-ration', name: 'Ration Card', isMandatory: true, isOfflineOnly: false },
          { id: 'item-water', name: 'Water Bill (Last 1 year)', isMandatory: true, isOfflineOnly: false },
          { id: 'item-elec', name: 'Electricity Bill (Last 1 year)', isMandatory: true, isOfflineOnly: false },
          { id: 'item-bank', name: 'Bank Passbook (with photo)', isMandatory: true, isOfflineOnly: false },
        ],
      },
      {
        id: 'sec-voter-id',
        title: 'General Identity & Photo',
        iconName: 'User',
        items: [
          { id: 'item-photo', name: 'Recent Passport Size Photo', isMandatory: true, isOfflineOnly: true },
          { id: 'item-family-voter', name: 'Family Member Voter ID No.', isMandatory: false, isOfflineOnly: false },
        ],
      },
    ],
  },
  {
    id: 'service-aadhaar',
    name: 'Aadhaar Services',
    iconName: 'Fingerprint',
    sections: [
      {
        id: 'sec-aadhaar-link',
        title: 'Link Mobile Number',
        description: 'Required for OTP based services.',
        iconName: 'Smartphone',
        items: [
          { id: 'item-aadhaar-card', name: 'Original Aadhaar Card', isMandatory: true, isOfflineOnly: true },
          { id: 'item-biometric', name: 'Biometric Auth (At Centre)', isMandatory: true, isOfflineOnly: true },
        ],
      },
      {
        id: 'sec-aadhaar-addr',
        title: 'Address Change / Update',
        iconName: 'Home',
        items: [
          { id: 'item-rent', name: 'Rent Agreement', isMandatory: false, isOfflineOnly: false },
          { id: 'item-voter', name: 'Voter ID Card', isMandatory: false, isOfflineOnly: false },
          { id: 'item-passport-a', name: 'Passport', isMandatory: false, isOfflineOnly: false },
        ],
      },
      {
        id: 'sec-aadhaar-doc',
        title: 'Document Update (10+ Years)',
        description: 'Mandatory if Aadhaar was made >10 years ago.',
        iconName: 'FileText',
        items: [
          { id: 'item-poi', name: 'Proof of Identity (PAN/Voter/Passport)', isMandatory: true, isOfflineOnly: false },
          { id: 'item-poa', name: 'Proof of Address (Elec Bill/Ration)', isMandatory: true, isOfflineOnly: false },
        ],
      },
      {
        id: 'sec-aadhaar-pan',
        title: 'PAN - Aadhaar Link',
        iconName: 'CreditCard',
        items: [
          { id: 'item-fee', name: 'Fee Payment Challan (Rs. 1000)', isMandatory: true, isOfflineOnly: false },
          { id: 'item-match', name: 'Name/DOB Match Verification', isMandatory: true, isOfflineOnly: false },
        ],
      },
    ],
  },
];
