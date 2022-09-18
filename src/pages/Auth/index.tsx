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
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { useContext, useEffect, useState } from "react";
import {
  MdClose,
  MdLockOutline,
  MdOutlineEmail,
  MdPersonOutline,
} from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";
import { request } from "../../api/utils";
import { ChatContext } from "../../utils/chatContext";
import lemon from "./lemon-shadow.svg";

export default function Auth() {
  const [mounted, setMounted] = useState(false);
  const [formType, setFormType] = useState<"register" | "login">("login");
  const [loading, setLoading] = useState(false);
  const [, , setLoggedIn] = useContext(ChatContext);

  const navigate = useNavigate();
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
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Is this an email?"),
      password: (value) =>
        /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(value)
          ? null
          : "What about min. 6 characters, including 1 digit?",
      confirmPassword: (val, values) =>
        formType === "login" || val === values?.password
          ? null
          : "Hmm, passwords don't match... Try again.",
    },
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleFormType = () => {
    setFormType((current) => (current === "register" ? "login" : "register"));
  };

  const showError = (msg: string = "Try again later") => {
    const alertMsg = {
      title: `A problem occured 🤔`,
      message: msg,
      color: "red",
      icon: <MdClose />,
    };
    showNotification(alertMsg);
  };

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (form.validate().hasErrors) {
      return showError("Make sure that all fields are filled in correctly");
    }

    setLoading(true);
    setTimeout(async () => {
      const { token, tokenSelector, user, isNewUser } = await authenticate(
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
      localStorage.setItem("doableId", user.doableId);
      localStorage.setItem("partyId", user.partyId ?? "");
      setLoggedIn(true);
      navigate(from, { state: { isNewUser }, replace: true });
    }, 250);
  }

  async function authenticate(
    email: string,
    password: string,
    name: string,
    surname: string
  ): Promise<any> {
    const data: Record<string, string> = { email, password };
    let endpoint = "/login";
    if (formType === "register") {
      data.name = name;
      data.surname = surname;
      endpoint = "/register";
    }
    const url = process.env.REACT_APP_DOABLE_API + endpoint;
    const res = await request("POST", url, "", "", data);
    if (res instanceof Error) {
      showError("Server error occured, try again later");
      return {};
    }

    const json = await res.json();
    if (!res.ok) {
      showError(`Problem: ${json.msg}, try again`);
      return {};
    }
    return { ...json, isNewUser: res.status === 201 };
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
            shadow={"sm"}
            style={{
              padding: "50px",
              width: "430px",
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
                    icon={<MdPersonOutline />}
                    value={form.values.name}
                    onBlur={() => form.validateField("name")}
                    {...form.getInputProps("name")}
                  />
                  <TextInput
                    mt="md"
                    required
                    label="Surname"
                    placeholder="Surname"
                    icon={<MdPersonOutline />}
                    value={form.values.surname}
                    onBlur={() => form.validateField("surname")}
                    {...form.getInputProps("surname")}
                  />
                </>
              )}

              <Group position="apart" mt="xl">
                <Button
                  type="submit"
                  styles={(theme) => ({
                    root: { color: theme.colors.gray[9] },
                  })}
                >
                  {formType === "register" ? "Register" : "Login"}
                </Button>
                <Anchor
                  component="button"
                  type="button"
                  color="gray.5"
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
