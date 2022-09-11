import {
  Button,
  Center,
  Group,
  Modal,
  PasswordInput,
  Space,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FormEvent, MouseEvent, useEffect, useState } from "react";
import { MdLockOutline, MdOutlineEmail, MdPersonOutline } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { APIClient, Method } from "../../../api/client";
import { IUser } from "../../../models/user";

interface UserAccountProps {
  user?: IUser;
}
const UserAccount = ({ user }: UserAccountProps) => {
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const navigate = useNavigate();
  const client = new APIClient();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (user) {
      form.setValues({
        email: user.email || "",
        password: "",
        confirmPassword: "",
        name: user.name || "",
        surname: user.surname || "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const editUserMutation = useMutation(
    (data: Partial<IUser>) =>
      client.singleUser(Method.PUT, user?.doableId!, {
        body: data,
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["user"]);
      },
    }
  );

  const deleteUserMutation = useMutation(
    () => client.singleUser(Method.DELETE, user?.doableId!),
    {
      onSuccess: () => {
        localStorage.clear();
        window.history.replaceState({}, document.title);
        navigate("/auth", { replace: true });
      },
    }
  );

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
        !value || /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(value)
          ? null
          : "What about min. 6 characters and 1 digit?",
      confirmPassword: (val, values) =>
        val === values?.password
          ? null
          : "Hmm, passwords don't match... Try again.",
    },
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (form.validate().hasErrors) {
      return;
    }
    editUserMutation.mutate(form.values);
  }

  function handleDelete(event: MouseEvent<HTMLElement>) {
    deleteUserMutation.mutate();
    setOpenDeleteModal(false);
  }

  return (
    <>
      <Modal
        centered
        opened={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        title="Delete acount"
      >
        <Text size="sm">
          Are you sure you want to delete your account? All tasks and statistics
          will be deleted. This action is irreversible.
        </Text>
        <Center style={{ height: "70px" }}>
          <Button
            variant="light"
            color={"gray"}
            onClick={() => setOpenDeleteModal(false)}
          >
            Cancel
          </Button>
          <Space w="md" />
          <Button variant="outline" color={"red"} onClick={handleDelete}>
            Delete account
          </Button>
        </Center>
      </Modal>
      <Stack style={{ flexBasis: "40%" }}>
        <Text size="xl" weight="bold">
          Edit profile
        </Text>
        <form onSubmit={handleSubmit}>
          <TextInput
            mt="md"
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
            placeholder="Password"
            label="Password"
            icon={<MdLockOutline />}
            onBlur={() =>
              form.values.password !== "" && form.validateField("password")
            }
            {...form.getInputProps("password")}
          />
          <PasswordInput
            mt="md"
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
            label="Name"
            placeholder="Name"
            icon={<MdPersonOutline />}
            value={form.values.name}
            onBlur={() => form.validateField("name")}
            {...form.getInputProps("name")}
          />
          <TextInput
            mt="md"
            label="Surname"
            placeholder="Surname"
            icon={<MdPersonOutline />}
            value={form.values.surname}
            onBlur={() => form.validateField("surname")}
            {...form.getInputProps("surname")}
          />

          <Group position="center" mt="xl">
            <Button
              variant="outline"
              color={"red"}
              onClick={() => setOpenDeleteModal(true)}
            >
              Delete account
            </Button>
            <Space />
            <Button
              type="submit"
              styles={(theme) => ({
                root: { color: theme.colors.gray[9] },
              })}
            >
              Save
            </Button>
          </Group>
        </form>
      </Stack>
    </>
  );
};

export default UserAccount;
