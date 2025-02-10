interface BodyWrapperProps {
  children: React.ReactNode;
}

export const BodyWrapper = ({ children }: BodyWrapperProps) => {
  return (
    <div className="mx-8 my-4 sm:mx-16 sm:my-8 max-w-full overflow-auto">
      {children}
    </div>
  );
};
