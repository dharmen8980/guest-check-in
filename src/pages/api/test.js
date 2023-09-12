export default async function handler(req, res) {
  const name = req.body.name;
  res.status(200).json({ name });
}
