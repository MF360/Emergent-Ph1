export async function signIn(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  console.log("Sign In action called with:", { email, password });
  // Implement your sign-in logic here
  return { ok: true };
}

export async function signUp(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  console.log("Sign Up action called with:", { name, email, password });
  // Implement your sign-up logic here
  return { ok: true };
}
