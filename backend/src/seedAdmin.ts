import "dotenv/config";
import bcrypt from "bcryptjs";
import connectDB from "./app/database/connection";
import { UserModel } from "./app/models/UserModel";

const seedAdmin = async () => {
  await connectDB();

  const {
    ADMIN_EMAIL,
    ADMIN_PASSWORD,
    ADMIN_DOCUMENT,
    ADMIN_PHONE,
  } = process.env;

  if (!ADMIN_EMAIL || !ADMIN_PASSWORD || !ADMIN_DOCUMENT || !ADMIN_PHONE) {
    console.error("❌ ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_DOCUMENT y ADMIN_PHONE son requeridos");
    process.exit(1);
  }

  const existingAdmin = await UserModel.findOne({ email: ADMIN_EMAIL.toLowerCase() });

  if (existingAdmin) {
    console.log("⚠️ El administrador ya existe");
    process.exit(0);
  }

  const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

  const admin = await UserModel.create({
    name: "Administrador",
    email: ADMIN_EMAIL.toLowerCase(),
    password: hashedPassword,
    document: ADMIN_DOCUMENT,
    phone: ADMIN_PHONE,
    role: "admin",
    active: true,
  });

  console.log(`✅ Administrador creado: ${admin.email}`);
  process.exit(0);
};

seedAdmin().catch((error) => {
  console.error("❌ Error al crear el administrador:", error);
  process.exit(1);
});
