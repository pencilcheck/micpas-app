import { Button, Select, Space, message } from "antd"
import { Key, useState } from "react";
import useQuery from "../hooks/useQuery";
import { createMailingList, loadMailingLists, updateMailingList } from "../pages/tabs/tab/MailingListRefresh.telefunc";

export { AddToMailingList }

const NEW_MAILING_LIST_MAGIC_ID = 999000666

function useLoadMailingLists() {
  const params = { limit: 99999 }
  const queryResult = useQuery(loadMailingLists, params)
  return queryResult;
}

function AddToMailingList({ personIds }: { personIds: string[] | Key[]; }) {
  const { data: { rows } } = useLoadMailingLists();
  const [selectedOption, setSelectedOption] = useState<number | null>()
  const [messageApi, contextHolder] = message.useMessage();

  const success = () => {
    messageApi.open({
      type: 'success',
      content: 'Success',
    });
  };

  const error = () => {
    messageApi.open({
      type: 'error',
      content: 'Error, please try again',
    });
  };

  const handleChange = (value: number) => {
    setSelectedOption(value);
  };

  const handleAddPersons = async ({ personIds, id }: { personIds: string[]; id: number; }) => {
    // magic code for new mailing list
    if (id === NEW_MAILING_LIST_MAGIC_ID) {
      const { mailingListId } = await createMailingList({});
      id = mailingListId;
    }
    const result = await updateMailingList({ newIds: personIds, mailingListId: id });
    if (result) {
      success();
    } else {
      error();
    }
    setSelectedOption(null);
    console.log(result)
  }

  return (
    <Space.Compact style={{ width: '100%' }}>
      {contextHolder}
      <Select
        allowClear
        style={{ width: '100%' }}
        placeholder="Select mailing list"
        value={selectedOption}
        onChange={handleChange}
        options={[...rows.map(r => ({ label: r.title, value: r.id })), { label: 'Create a New mailing list', value: NEW_MAILING_LIST_MAGIC_ID }]}
      />
      <Button disabled={!selectedOption} onClick={() => selectedOption && handleAddPersons({ personIds, id: selectedOption })} type="primary">
        Add to mailing list
      </Button>
    </Space.Compact>
  )
}
