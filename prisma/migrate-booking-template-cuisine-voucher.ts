import { PrismaClient } from "@prisma/client";

const p = new PrismaClient();
const DETAIL = '<p style="font-size:16px;color:#484848;margin-bottom:8px;">';

async function main() {
  const t = await p.emailTemplate.findUnique({
    where: { key: "booking-confirmation" },
  });
  if (!t) throw new Error("booking-confirmation template not found");

  let body = t.body;

  if (!body.includes("{cuisine}")) {
    body = body.replace(
      "<strong>Datum:</strong> {workshopDate}</p>",
      "<strong>Datum:</strong> {workshopDate}</p>\n" +
        DETAIL +
        "<strong>Keuken:</strong> {cuisine}</p>"
    );
  }

  if (!body.includes("{voucherInfo}")) {
    body = body.replace(
      "<strong>Betaalmethode:</strong> {paymentMethod}</p>",
      "<strong>Betaalmethode:</strong> {paymentMethod}</p>\n" +
        DETAIL +
        "{voucherInfo}</p>"
    );
  }

  const variables = Array.from(
    new Set([
      ...t.variables.filter((v) => v !== "{giftCardId}"),
      "{cuisine}",
      "{voucherCode}",
      "{voucherInfo}",
    ])
  );

  await p.emailTemplate.update({
    where: { key: "booking-confirmation" },
    data: { body, variables },
  });

  const after = await p.emailTemplate.findUniqueOrThrow({
    where: { key: "booking-confirmation" },
    select: { variables: true, body: true },
  });
  console.log("VARIABLES:", JSON.stringify(after.variables));
  console.log("HAS_CUISINE_LINE:", after.body.includes("{cuisine}"));
  console.log("HAS_VOUCHER_LINE:", after.body.includes("{voucherInfo}"));
}

main()
  .then(() => p.$disconnect())
  .catch((e) => {
    console.error("ERR", e.message);
    process.exit(1);
  });
