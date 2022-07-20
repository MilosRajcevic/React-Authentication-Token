export async function SendSignRequest(requestConfig) {
  const response = await fetch(requestConfig.url, {
    method: "POST",
    body: JSON.stringify(requestConfig.body),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error.message || "Wrong");
  }

  const responseData = {
    idToken: data.idToken,
    email: data.email,
    refreshToken: data.refreshToken,
    expiresIn: data.expiresIn,
  };

  return responseData;
}
