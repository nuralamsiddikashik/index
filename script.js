function addRow() {
  document.getElementById("formRows").insertAdjacentHTML(
    "beforeend",
    `
        <tr>
            <td><input type="text" oninput="syncInvoice()"></td>
            <td><input type="text" oninput="syncInvoice()"></td>
            <td><input type="text" class="amount" oninput="syncInvoice()"></td>
            <td><button onclick="removeRow(this)">✖</button></td>
        </tr>
    `,
  );
}

function removeRow(btn) {
  btn.closest("tr").remove();
  syncInvoice();
}

/* Format number with comma and .00 */
function formatMoney(amount) {
  return Number(amount).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
function parseMoney(value) {
  return Number(value.replace(/,/g, "")) || 0;
}

/* Real-time Sync Invoice */
function syncInvoice() {
  // Date
  let selectedDate = document.getElementById("billDate").value;
  if (selectedDate) {
    let d = new Date(selectedDate);
    document.getElementById("invoiceDate").innerText =
      d.toLocaleDateString("en-GB");
  } else {
    document.getElementById("invoiceDate").innerText = "";
  }

  let rows = document.querySelectorAll("#formRows tr");
  let invoiceBody = document.getElementById("invoiceRows");
  invoiceBody.innerHTML = "";

  let total = 0;
  rows.forEach((r) => {
    let from = r.children[0].querySelector("input").value;
    let to = r.children[1].querySelector("input").value;
    let amountInput = r.children[2].querySelector("input");

    let rawAmount = parseMoney(amountInput.value);
    total += rawAmount;

    if (amountInput.value !== "") {
      amountInput.value = formatMoney(rawAmount);
    }

    if (from || to || rawAmount) {
      invoiceBody.innerHTML += `
                <tr>
                    <td>${from}</td>
                    <td>${to}</td>
                    <td>${formatMoney(rawAmount)}</td>
                </tr>
            `;
    }
  });

  document.getElementById("invoiceTotal").innerText = formatMoney(total);
  document.getElementById("amountWords").innerText = total
    ? numberToWords(total) + " Taka Only"
    : "";
}

/* Number to Words (English) */
function numberToWords(num) {
  const ones = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const tens = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  if (num < 20) return ones[num];
  if (num < 100)
    return (
      tens[Math.floor(num / 10)] + (num % 10 > 0 ? " " + ones[num % 10] : "")
    );
  if (num < 1000)
    return ones[Math.floor(num / 100)] + " Hundred " + numberToWords(num % 100);
  if (num < 100000)
    return (
      numberToWords(Math.floor(num / 1000)) +
      " Thousand " +
      numberToWords(num % 1000)
    );
  if (num < 10000000)
    return (
      numberToWords(Math.floor(num / 100000)) +
      " Lakh " +
      numberToWords(num % 100000)
    );
  return (
    numberToWords(Math.floor(num / 10000000)) +
    " Crore " +
    numberToWords(num % 10000000)
  );
}

/* Download PDF */
function downloadPDF() {
  html2pdf()
    .from(document.getElementById("invoice"))
    .save("conveyance-bill.pdf");
}
