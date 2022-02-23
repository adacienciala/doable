import {
  Anchor,
  Button,
  Center,
  Group,
  GroupedTransition,
  Image,
  LoadingOverlay,
  Paper,
  PasswordInput,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/hooks";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import lemon from "./lemon-shadow.svg";

function Login() {
  let navigate = useNavigate();
  let location = useLocation() as any;

  let from = location.state?.from?.pathname || "/";

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    let formData = new FormData(event.currentTarget);
    let username = formData.get("username") as string;

    localStorage.setItem("username", username);

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate(from, { replace: true });
    }, 1000);
  }

  const [formType, setFormType] = useState<"register" | "login">("login");
  const [loading, setLoading] = useState(false);

  const toggleFormType = () => {
    setFormType((current) => (current === "register" ? "login" : "register"));
  };

  const form = useForm({
    initialValues: { email: "", password: "", confirmPassword: "" },
    validationRules: {
      email: (value) => /^\S+@\S+$/.test(value),
      password: (value) => /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(value),
      confirmPassword: (val, values) =>
        formType === "login" || val === values?.password,
    },
    errorMessages: {
      email: "Invalid email",
      confirmPassword: "Passwords don't match. Try again",
    },
  });

  return (
    <GroupedTransition
      mounted={true}
      transitions={{
        lemon: { duration: 1000, transition: "slide-down" },
        "login-box": {
          duration: 1000 / 2,
          transition: "fade",
          timingFunction: "ease",
        },
      }}
    >
      {(styles) => (
        <Center>
          <Paper
            padding={50}
            shadow={"sm"}
            style={{
              ...styles["login-box"],
              position: "relative",
              backgroundColor: "rgba(61, 67, 75, 0.75)",
            }}
          >
            <LoadingOverlay visible={loading} />
            <form onSubmit={handleSubmit}>
              <TextInput
                mt="md"
                required
                label="Email"
                placeholder="You email"
                value={form.values.email}
                onBlur={() => form.validateField("email")}
                {...form.getInputProps("email")}
              />
              <PasswordInput
                mt="md"
                required
                placeholder="Password"
                label="Password"
                // icon={<LockClosedIcon />}
                {...form.getInputProps("password")}
              />

              {formType === "register" && (
                <PasswordInput
                  mt="md"
                  required
                  label="Confirm Password"
                  placeholder="Confirm password"
                  // icon={<LockClosedIcon />}
                  {...form.getInputProps("confirmPassword")}
                />
              )}

              <Group position="apart" mt="xl">
                <Button type="submit">
                  {formType === "register" ? "Register" : "Login"}
                </Button>
                <Anchor
                  component="button"
                  type="button"
                  color="gray"
                  onClick={toggleFormType}
                  size="sm"
                >
                  {formType === "register"
                    ? "Have an account? Login"
                    : "Don't have an account? Register"}
                </Anchor>
              </Group>
            </form>
          </Paper>
          <Image
            src={lemon}
            alt="lemon icon"
            height={"60vh"}
            style={{ ...styles["lemon"] }}
          />
        </Center>
      )}
    </GroupedTransition>
  );
}

export default Login;
