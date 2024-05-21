import { Alert, Button, Skeleton, Space } from "antd";
import { Suspense } from "react";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";

export { ErrorBound, Loading, ErrorFallback };

function Loading() {
  return (
    <Skeleton active>
    </Skeleton>
  )
}

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <Space direction="vertical" className="w-full text-center">
      <Alert
        message="Failed to load"
        description={error.message}
        type="error"
      />
      <Button onClick={() => resetErrorBoundary()}>Try again</Button>
    </Space>
  );
}

function ErrorBound({ children }: React.PropsWithChildren) {
  return (
    <Suspense fallback={<Loading />}>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        {children}
      </ErrorBoundary>
    </Suspense>
  )
}
