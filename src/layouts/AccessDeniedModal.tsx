import { Button, Modal, Stack } from "@mantine/core";
import { useLocation, useNavigate } from "react-router-dom";

export const AccessDeniedModal = ({ visible }: { visible: boolean }) => {
  const location = useLocation() as any;
  const navigate = useNavigate();
  return (
    <>
      <Modal
        centered
        overlayBlur={3}
        transition="fade"
        transitionDuration={600}
        onClose={() => {
          localStorage.clear();
          navigate("/auth", { state: { from: location }, replace: false });
        }}
        opened={visible}
        withCloseButton={false}
      >
        <Stack align={"center"}>
          You no longer have access to this page.
          <Button
            variant="subtle"
            onClick={() => {
              localStorage.clear();
              navigate("/auth", { state: { from: location }, replace: false });
            }}
          >
            Log In
          </Button>
        </Stack>
      </Modal>
    </>
  );
};
