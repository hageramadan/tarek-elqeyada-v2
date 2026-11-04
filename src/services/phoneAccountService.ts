interface PhoneAccountData {
  name: string;
  phone: string;
  country_code?: string;
}

export async function authenticatePhoneAccount(account: PhoneAccountData) {
  const country_code = account.country_code || "+966";
  const request = async (action: "login" | "register") => {
    const response = await fetch(`https://admin.tareqalqeyada.sa/api/user/${action}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        country_code,
        phone: account.phone,
        ...(action === "register" ? { name: account.name } : {}),
      }),
    });
    const data = await response.json();
    return { data, ok: response.ok && data.result === true };
  };

  let result = await request("login");
  if (!result.ok) {
    const missingPhone = /phone number is not registered|phone.*not (?:registered|found)|رقم.*غير مسجل/i;
    if (!missingPhone.test(String(result.data.message || ""))) {
      throw new Error(result.data.message || "تعذر تسجيل الدخول. حاول لاحقًا.");
    }
    result = await request("register");
    if (!result.ok) {
      throw new Error("تعذر إنشاء الحساب. راجع البيانات وحاول مرة أخرى.");
    }
    if (!result.data.data?.user?.token) result = await request("login");
  }

  if (!result.ok || !result.data.data?.user?.token) {
    throw new Error("تعذر إكمال تسجيل الدخول. حاول لاحقًا.");
  }
  return result.data;
}
