function AuthLayout({ children, title }) {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-base-200 px-4">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="text-2xl font-bold text-center mb-4">{title}</h2>
          {children}
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;