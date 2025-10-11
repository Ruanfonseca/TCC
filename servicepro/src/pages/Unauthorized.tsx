export default function Unauthorized() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-3xl font-bold text-red-500">Acesso negado 🚫</h1>
      <p className="mt-2 text-gray-500">
        Você não tem permissão para acessar esta página.
      </p>
    </div>
  );
}
