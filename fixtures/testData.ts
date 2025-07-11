export interface ContactData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export interface BookingData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  checkin: string;
  checkout: string;
}

export const validContactData: ContactData = {
  name: "Juan Pérez",
  email: "juan.perez@email.com", 
  phone: "+1234567890",
  subject: "Consulta sobre habitaciones",
  message: "Hola, me gustaría obtener más información sobre las habitaciones disponibles para el próximo mes."
};

export const invalidContactData: ContactData = {
  name: "",
  email: "email-invalido", 
  phone: "123",
  subject: "",
  message: ""
};

export const validBookingData: BookingData = {
  firstName: "María",
  lastName: "González",
  email: "maria.gonzalez@email.com",
  phone: "+1987654321",
  checkin: "2025-08-15",
  checkout: "2025-08-18"
};

export const invalidBookingData: BookingData = {
  firstName: "",
  lastName: "",
  email: "email-invalido",
  phone: "abc",
  checkin: "2025-01-01", // Fecha pasada
  checkout: "2025-01-01"  // Misma fecha de entrada
};

export const pastDatesBooking: BookingData = {
  firstName: "Carlos",
  lastName: "Rodríguez",
  email: "carlos.rodriguez@email.com",
  phone: "+1555666777",
  checkin: "2024-12-01", // Fecha pasada
  checkout: "2024-12-05"  // Fecha pasada
};

export const futureDatesBooking: BookingData = {
  firstName: "Ana",
  lastName: "Martínez",
  email: "ana.martinez@email.com",
  phone: "+1444555666",
  checkin: "2025-12-20",
  checkout: "2025-12-25"
};

// Datos para pruebas parametrizadas
export const contactFormTestData = [
  {
    testCase: "Datos válidos completos",
    data: validContactData,
    expectedResult: "success"
  },
  {
    testCase: "Campos vacíos",
    data: invalidContactData,
    expectedResult: "error"
  },
  {
    testCase: "Email inválido",
    data: {
      ...validContactData,
      email: "email-sin-formato-valido"
    },
    expectedResult: "error"
  },
  {
    testCase: "Teléfono muy corto",
    data: {
      ...validContactData,
      phone: "123"
    },
    expectedResult: "error"
  }
];

export const availabilityTestData = [
  {
    testCase: "Fechas futuras válidas",
    checkin: "2025-09-15",
    checkout: "2025-09-18",
    expectedAvailable: true
  },
  {
    testCase: "Fechas pasadas",
    checkin: "2024-12-01", 
    checkout: "2024-12-05",
    expectedAvailable: false
  },
  {
    testCase: "Misma fecha entrada y salida",
    checkin: "2025-08-15",
    checkout: "2025-08-15",
    expectedAvailable: false
  },
  {
    testCase: "Fecha salida anterior a entrada",
    checkin: "2025-08-20",
    checkout: "2025-08-15",
    expectedAvailable: false
  }
];
