import { useState, useEffect } from "react";
import {
  Button,
  Table,
  Tag,
  Input,
  Tooltip,
  Space,
  Modal,
  Form,
  DatePicker,
  Mentions,
  Radio,
} from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
const { Search } = Input;

const TO_BE_CONFIRMED = 0;
const AWAITING_RESPONSE = 1;

function App() {
  const [todos, setTodos] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [modalOpened, setModalOpened] = useState(false);
  const [statusOption, setStatusOption] = useState("Open");
  const [action, setAction] = useState({
    id: null,
    state: null,
  });

  const visibleTodos =
    searchText === ""
      ? todos
      : todos.filter((todo) => {
          const iSearchText = searchText.toLowerCase();
          const propsToCheck = [
            "timeStamp",
            "dueDate",
            "tags",
            "status",
            "description",
            "title",
          ];
          let hasMatch = false;
          // loop until match found or there is nothing left to check
          while (!hasMatch && propsToCheck.length > 0) {
            const prop = propsToCheck.pop();
            const propValue = todo[prop];
            // tags is Array and I also want to check if the tag only starts with the search value
            if (prop === "tags") {
              hasMatch = propValue.some((value) =>
                value.toLowerCase().startsWith(iSearchText)
              );
            } else {
              hasMatch = propValue.toLowerCase().includes(iSearchText);
            }
          }

          return hasMatch;
        });

  useEffect(() => {
    fetch("/api/todos")
      .then((res) => res.json())
      .then((data) => {
        setTodos(data.todos);
      });
  }, []);

  // We know there are going to be only these 4 statuses
  // There is no need to get them dynamicaly from todos
  const statusFilters = ["Open", "Working", "Overdue", "Done"];
  // Tags are unknown in advance so it needs to be extracted from todos
  const tagsFilters = todos
    ? Array.from(
        todos.reduce((uniqueTags, { tags }) => {
          for (const tag of tags) {
            uniqueTags.add(tag);
          }
          return uniqueTags;
        }, new Set())
      ).map((tag) => ({
        text: tag[0].toUpperCase() + tag.slice(1),
        value: tag,
      }))
    : [];

  function handleCreateClick() {
    setModalOpened(true);
  }

  function handleModalCancel() {
    setModalOpened(false);
  }

  function handleEditClick(id) {
    console.log("edit: " + id);
  }

  function handleDeleteClick(id) {
    const { state, id: actionId } = action;

    if (state === null || actionId !== id) {
      setAction({
        id: id,
        state: TO_BE_CONFIRMED,
      });
    } else if (state === TO_BE_CONFIRMED && actionId === id) {
      deleteTodo();
    }
  }

  function resetAction() {
    setAction({ id: null, state: null });
  }

  function deleteTodo() {
    const { id } = action;

    setAction((prev) => ({
      ...prev,
      state: AWAITING_RESPONSE,
    }));

    fetch("/api/todos/" + id, {
      method: "DELETE",
    }).then((res) => {
      if (!res.ok) return;
      resetAction();
      setTodos(todos.filter((todo) => todo.id !== id));
    });
  }

  const columns = [
    {
      title: "Timestamp created",
      dataIndex: "timeStamp",
      key: "timeStamp",
      // This is a use of Object destructuring with assigning
      // new names(aliases) for the original property names
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#object_destructuring
      sorter: ({ timeStamp: timeStampA }, { timeStamp: timeStampB }) =>
        new Date(timeStampA) - new Date(timeStampB),
    },
    {
      title: "Task",
      dataIndex: "title",
      key: "title",
      sorter: ({ title: titleA }, { title: titleB }) => {
        if (titleA === titleB) return 0;
        return titleA > titleB ? 1 : -1;
      },
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      sorter: ({ description: descA }, { description: descB }) => {
        if (descA === descB) return 0;
        return descA > descB ? 1 : -1;
      },
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
      key: "dueDate",
      sorter: ({ dueDate: dueDateA }, { dueDate: dueDateB }, order) => {
        // both empty
        if ((dueDateA === dueDateB) === "") {
          return 0;
          // only first empty
        } else if (dueDateA === "") {
          return order === "ascend" ? 1 : -1;
          // only second empty
        } else if (dueDateB === "") {
          return order === "ascend" ? -1 : 1;
          // both have values
        } else {
          return new Date(dueDateA) - new Date(dueDateB);
        }
      },
    },
    {
      title: "Tags",
      dataIndex: "tags",
      key: "tags",
      filters: tagsFilters,
      onFilter: (value, { tags }) => tags.includes(value),
      render: (tags, { id }) => {
        return (
          <>
            {tags.map((tag) => (
              <Tag key={tag + id}>{tag.toUpperCase()}</Tag>
            ))}
          </>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      filters: statusFilters,
      onFilter: (value, { status }) => status === value,
    },
    {
      title: "Actions",
      render: (_, { id }) => {
        const isAwaitingResponse =
          action.id === id && action.state === AWAITING_RESPONSE;
        const isToBeConfirmed =
          action.id === id && action.state === TO_BE_CONFIRMED;

        return (
          <Space direction="horizontal">
            <Tooltip title="Edit" mouseEnterDelay={0.5}>
              <Button
                onClick={() => handleEditClick(id)}
                icon={<EditOutlined />}
              ></Button>
            </Tooltip>
            <Tooltip title="Delete" mouseEnterDelay={0.5}>
              <Button
                onClick={() => handleDeleteClick(id)}
                icon={<DeleteOutlined />}
                loading={isAwaitingResponse}
                danger={isAwaitingResponse || isToBeConfirmed}
              ></Button>
            </Tooltip>
          </Space>
        );
      },
    },
  ];

  return (
    <>
      <Space.Compact block size="middle">
        <Search
          placeholder="input search text"
          onSearch={setSearchText}
          onChange={({ target }) => target.value === "" && setSearchText("")}
          style={{
            width: 300,
          }}
        />
        <Button
          type="default"
          icon={<PlusOutlined />}
          size="middle"
          onClick={handleCreateClick}
        >
          Create
        </Button>
      </Space.Compact>
      <Table columns={columns} dataSource={visibleTodos} />
      <Modal
        open={modalOpened}
        onCancel={handleModalCancel}
        title="Create new todo"
      >
        <Space direction="vertical" align="center">
          <Form
            name="create"
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 16,
            }}
            style={{
              width: "100%",
            }}
            initialValues={{
              remember: true,
              duedate: [dayjs(), null],
              status: "Open",
            }}
            autoComplete="off"
          >
            <Form.Item
              label="Task"
              name="title"
              rules={[
                {
                  required: true,
                  message: "Please input todo's title!",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Description"
              name="description"
            >
              <Input />
            </Form.Item>

            <Form.Item label="Due Date" name="duedate">
              <DatePicker.RangePicker disabled={[true, false]} />
            </Form.Item>

            <Form.Item label="Tags" name="tags">
              <Mentions
                placeholder="input # to mention tag"
                prefix={["#"]}
                options={(tagsFilters || []).map(({ value }) => ({
                  key: value,
                  value,
                  label: value,
                }))}
              />
            </Form.Item>

            <Form.Item label="Status" name="status">
              <Radio.Group
                options={["Open", "Working"]}
                // onChange={({ target: { value } }) => setStatusOption(value)}
                optionType="button"
                buttonStyle="solid"
              />
            </Form.Item>

            <Form.Item
              wrapperCol={{
                offset: 8,
                span: 16,
              }}
            ></Form.Item>
          </Form>
        </Space>
      </Modal>
    </>
  );
}

export default App;
