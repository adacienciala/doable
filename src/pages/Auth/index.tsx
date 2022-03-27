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
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import lemon from "./lemon-shadow.svg";
import { MdLockOutline, MdOutlineEmail, MdClose } from "react-icons/md";
import { request } from "../../api/utils";
import { useNotifications } from "@mantine/notifications";

export default function Auth() {
  const [mounted, setMounted] = useState(false);
  const [alertMsg, setAlertMsg] = useState({
    title: `A problem occured 🤔`,
    message: "Try again later",
    color: "red",
    icon: <MdClose />,
  });
  const [formType, setFormType] = useState<"register" | "login">("login");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const notifications = useNotifications();
  const location = useLocation() as any;
  const from = location.state?.from?.pathname || "/";

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
      surname: "",
    },
    validationRules: {
      email: (value) => /^\S+@\S+$/.test(value),
      password: (value) => /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(value),
      confirmPassword: (val, values) =>
        formType === "login" || val === values?.password,
    },
    errorMessages: {
      email: "Is this an email?",
      password: "Please, min. 6 characters with min. 1 digit.",
      confirmPassword: "Hmm, passwords don't match... Try again.",
    },
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) notifications.showNotification(alertMsg);
  }, [alertMsg]);

  const toggleFormType = () => {
    setFormType((current) => (current === "register" ? "login" : "register"));
  };

  const showError = (msg: string = "Try again later") => {
    setAlertMsg((prev) => ({
      ...prev,
      message: msg,
    }));
  };

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.validate()) {
      return showError("Make sure that all fields are filled in correctly");
    }

    setLoading(true);
    setTimeout(async () => {
      const { token, tokenSelector } = await authenticate(
        form.values.email,
        form.values.password,
        form.values.name,
        form.values.surname
      );
      if (!token) {
        return setLoading(false);
      }
      localStorage.setItem("token", token);
      localStorage.setItem("tokenSelector", tokenSelector);
      setLoading(false);
      navigate(from, { replace: true });
    }, 250);
  }

  async function authenticate(
    email: string,
    password: string,
    name: string,
    surname: string
  ): Promise<any> {
    let data: any = { email, password };
    let endpoint = "/login";
    if (formType === "register") {
      data.name = name;
      data.surname = surname;
      endpoint = "/register";
    }
    // const url = process.env.REACT_APP_DOABLE_API + endpoint;
    const url = process.env.REACT_APP_DOABLE_LOCALHOST + endpoint;
    const res = (await request("POST", url, data)) as Response;
    if (res === null) {
      return showError("Server error occured, try again later");
    }
    try {
      const json = await res.json();
      if (!res.ok) {
        return showError(`Problem: ${json.msg}, try again`);
      }
      return json;
    } catch (e) {
      return showError("Server error occured, try again later");
    }
  }

  return (
    <GroupedTransition
      mounted={mounted}
      transitions={{
        lemon: { duration: 1000, transition: "slide-down" },
        "login-box": {
          duration: 1000,
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
              width: "400px",
              ...styles["login-box"],
              backgroundColor: "rgba(61, 67, 75, 0.75)",
            }}
          >
            <LoadingOverlay visible={loading} />
            <Image
              src={lemon}
              alt="lemon icon"
              style={{
                width: "100px",
                position: "relative",
                left: "35%",
                marginTop: "-45%",
                ...styles["lemon"],
              }}
            />
            <form onSubmit={handleSubmit}>
              <TextInput
                mt="md"
                required
                label="Email"
                placeholder="Email"
                value={form.values.email}
                icon={<MdOutlineEmail />}
                onBlur={() =>
                  form.values.email !== "" && form.validateField("email")
                }
                {...form.getInputProps("email")}
              />
              <PasswordInput
                mt="md"
                required
                placeholder="Password"
                label="Password"
                icon={<MdLockOutline />}
                onBlur={() =>
                  form.values.password !== "" && form.validateField("password")
                }
                {...form.getInputProps("password")}
              />

              {formType === "register" && (
                <>
                  <PasswordInput
                    mt="md"
                    required
                    label="Confirm Password"
                    placeholder="Confirm password"
                    icon={<MdLockOutline />}
                    onBlur={() =>
                      form.values.confirmPassword !== "" &&
                      form.validateField("confirmPassword")
                    }
                    {...form.getInputProps("confirmPassword")}
                  />
                  <TextInput
                    mt="md"
                    required
                    label="Name"
                    placeholder="Name"
                    value={form.values.name}
                    onBlur={() => form.validateField("name")}
                    {...form.getInputProps("name")}
                  />
                  <TextInput
                    mt="md"
                    required
                    label="Surname"
                    placeholder="Surname"
                    value={form.values.surname}
                    onBlur={() => form.validateField("surname")}
                    {...form.getInputProps("surname")}
                  />
                </>
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
        </Center>
      )}
    </GroupedTransition>
  );
}
