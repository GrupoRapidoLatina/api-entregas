import type { PrismaService } from '../../src/core/database/prisma.service';

export type Row = Record<string, unknown>;

export type MemoryDb = {
  users: Row[];
  orders: Row[];
  settings: Row[];
  notifications: Row[];
  historicos: Row[];
  statuses: Row[];
  reviews: Row[];
  reports: Row[];
  operacoes: Row[];
  rawRows: Row[];
};

function matches(row: Row, where?: Record<string, unknown>): boolean {
  if (!where) return true;
  return Object.entries(where).every(([key, expected]) => {
    if (key === 'OR' && Array.isArray(expected)) {
      return expected.some((clause) =>
        matches(row, clause as Record<string, unknown>),
      );
    }
    if (key === 'AND' && Array.isArray(expected)) {
      return expected.every((clause) =>
        matches(row, clause as Record<string, unknown>),
      );
    }
    if (
      expected &&
      typeof expected === 'object' &&
      !Array.isArray(expected) &&
      !(expected instanceof Date)
    ) {
      const filter = expected as Record<string, unknown>;
      if ('in' in filter && Array.isArray(filter.in)) {
        return filter.in.includes(row[key]);
      }
    }
    return row[key] === expected;
  });
}

function sortRows(rows: Row[], orderBy?: Record<string, 'asc' | 'desc'>): Row[] {
  if (!orderBy) return rows;
  const [key, direction] = Object.entries(orderBy)[0] ?? [];
  if (!key || !direction) return rows;
  return [...rows].sort((left, right) => {
    const a = left[key] as number | string;
    const b = right[key] as number | string;
    if (a === b) return 0;
    const ascending = a > b ? 1 : -1;
    return direction === 'desc' ? -ascending : ascending;
  });
}

export function blankOrder(partial: Row = {}): Row {
  return {
    id: 1,
    orderId: '1',
    userId: 7,
    driverId: 0,
    pickupaddress: 'Rua A',
    dropoffaddress: 'Rua B',
    pickupFirstName: null,
    pickupLastName: null,
    pickupMobNumber: null,
    dropoffFirstName: null,
    dropoffLastName: null,
    dropoffMobNumber: null,
    deliveryStatus: 5,
    deliveryDate: null,
    deliveryTime: null,
    deliveryCost: '20.00',
    deliveryType: '2HOUR',
    vehicleType: 'motorbike',
    nfNumero: null,
    pickupLat: '-23.5',
    pickupLong: '-46.6',
    dropoffLat: '-23.6',
    dropoffLong: '-46.7',
    signatureName: null,
    signatureImage: null,
    receivedUserImage: null,
    pdfUrl: null,
    itemDescription: null,
    dropoffSpecialInst: null,
    pickupComapnyName: null,
    dropoffComapnyName: null,
    createdAt: new Date('2026-09-30T15:00:00.000Z'),
    idOperacao: 3,
    ...partial,
  };
}

export function activeUser(partial: Row = {}): Row {
  return {
    userId: 7,
    userType: 1,
    userStatus: 1,
    loginStatus: 'no',
    deviceToken: 'device-7',
    email: 'ana@example.com',
    password: 'senha1234',
    firstname: 'Ana',
    lastname: 'Souza',
    phone: '+5511999999999',
    dob: '1990-01-01',
    vehicleType: 'motorbike',
    profileImage: 'ana.jpg',
    vehicleNo: '1',
    companyName: 'Rapido',
    licenceImageFront: null,
    licenceImageBack: null,
    suburb: 'Centro',
    postcode: '01000-000',
    state: 'SP',
    countryName: 'Brasil',
    streetName: 'Rua A',
    houseNo: '10',
    vehicleRegNo: 'ABC1D23',
    countryCode: '+55',
    idOperacao: 3,
    verify: '1234',
    forgetTime: null,
    regType: null,
    ...partial,
  };
}

export function createMemoryPrisma() {
  const db: MemoryDb = {
    users: [],
    orders: [],
    settings: [],
    notifications: [],
    historicos: [],
    statuses: [],
    reviews: [],
    reports: [],
    operacoes: [],
    rawRows: [],
  };
  const userSeq = { n: 0 };
  const orderSeq = { n: 0 };

  function insert(list: Row[], data: Row, idKey: string, seq?: { n: number }) {
    const row: Row = { ...data };
    if (seq && row[idKey] == null) {
      seq.n += 1;
      row[idKey] = seq.n;
    }
    list.push(row);
    return row;
  }

  function updateOne(list: Row[], where: Row, data: Row) {
    const row = list.find((item) => matches(item, where));
    if (!row) throw new Error('Registro não encontrado');
    Object.assign(row, data);
    return row;
  }

  function updateMany(list: Row[], where: Row, data: Row) {
    const rows = list.filter((item) => matches(item, where));
    rows.forEach((row) => Object.assign(row, data));
    return { count: rows.length };
  }

  const client = {
    user: {
      findUnique: async ({ where }: { where: Row }) =>
        db.users.find((row) => matches(row, where)) ?? null,
      findFirst: async ({ where }: { where: Row }) =>
        db.users.find((row) => matches(row, where)) ?? null,
      create: async ({ data }: { data: Row }) =>
        insert(db.users, data, 'userId', userSeq),
      update: async ({ where, data }: { where: Row; data: Row }) =>
        updateOne(db.users, where, data),
      updateMany: async ({ where, data }: { where: Row; data: Row }) =>
        updateMany(db.users, where, data),
    },
    setting: {
      findFirst: async () => db.settings[0] ?? null,
    },
    order: {
      findUnique: async ({ where }: { where: Row }) =>
        db.orders.find((row) => matches(row, where)) ?? null,
      findFirst: async ({ where }: { where: Row }) =>
        db.orders.find((row) => matches(row, where)) ?? null,
      findMany: async ({
        where,
        orderBy,
      }: {
        where?: Row;
        orderBy?: Record<string, 'asc' | 'desc'>;
      }) => sortRows(db.orders.filter((row) => matches(row, where)), orderBy),
      create: async ({ data }: { data: Row }) =>
        insert(db.orders, data, 'id', orderSeq),
      update: async ({ where, data }: { where: Row; data: Row }) =>
        updateOne(db.orders, where, data),
      updateMany: async ({ where, data }: { where: Row; data: Row }) =>
        updateMany(db.orders, where, data),
    },
    notification: {
      create: async ({ data }: { data: Row }) => {
        db.notifications.push({ ...data });
        return data;
      },
    },
    orderHistorico: {
      create: async ({ data }: { data: Row }) => {
        db.historicos.push({ ...data });
        return data;
      },
    },
    status: {
      findFirst: async ({ where }: { where: Row }) =>
        db.statuses.find((row) => matches(row, where)) ?? null,
      findMany: async ({
        where,
        orderBy,
      }: {
        where?: Row;
        orderBy?: Record<string, 'asc' | 'desc'>;
      }) =>
        sortRows(db.statuses.filter((row) => matches(row, where)), orderBy),
    },
    review: {
      findMany: async ({ where }: { where?: Row }) =>
        db.reviews.filter((row) => matches(row, where)),
      aggregate: async () => ({
        _max: {
          id: db.reviews.reduce(
            (max, row) => Math.max(max, Number(row.id ?? 0)),
            0,
          ),
        },
      }),
      create: async ({ data }: { data: Row }) => {
        db.reviews.push({ ...data });
        return data;
      },
    },
    driverReport: {
      create: async ({ data }: { data: Row }) => {
        db.reports.push({ ...data });
        return data;
      },
    },
    operacao: {
      findMany: async ({ where }: { where?: Row }) =>
        db.operacoes.filter((row) => matches(row, where)),
    },
    $queryRaw: async () => db.rawRows,
    $connect: async () => undefined,
    $disconnect: async () => undefined,
  };

  return { db, client: client as unknown as PrismaService };
}
