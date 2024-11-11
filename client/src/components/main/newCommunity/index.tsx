import React from 'react';
import Form from '../baseComponents/form';
import Input from '../baseComponents/input';
import useCommunityForm from '../../../hooks/useCommunityForm';

/**
 * NewCommunityPage component allows users to create a new community with a name.
 */
const NewCommunityPage = () => {
  const { name, setName, createCommunity, createErr } = useCommunityForm();

  return (
    <Form>
      <Input
        title={'Community Name'}
        hint={'Limit title to 100 characters or less'}
        id={'formNameInput'}
        val={name}
        setState={setName}
        err={createErr}
      />
      <div className='btn_indicator_container'>
        <button className='form_postBtn' onClick={createCommunity}>
          Create Community
        </button>
        <div className='mandatory_indicator'>* indicates mandatory fields</div>
      </div>
    </Form>
  );
};

export default NewCommunityPage;
