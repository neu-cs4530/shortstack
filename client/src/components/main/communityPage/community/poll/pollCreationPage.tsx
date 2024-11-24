import useCreatePoll from '../../../../../hooks/useCreatePoll';
import CommunityBreadcrumb from '../breadcrumb/communityBreadcrumb';
import './pollCreationPage.css';

const PollCreationPage = () => {
  const {
    title,
    dueDate,
    options,
    error,
    communityID,
    handleTitleChange,
    handleDueDateChange,
    handleOptionChange,
    handleAddOption,
    handleSubmit,
  } = useCreatePoll();

  return (
    <>
      <CommunityBreadcrumb communityID={communityID} subPageType='New Poll' />
      <div className='poll-creation-container'>
        <h1>Create a New Poll</h1>
        {error && <p className='error'>{error}</p>}

        <form
          onSubmit={e => {
            e.preventDefault();
            handleSubmit();
          }}>
          <label>
            Poll Title:
            <input type='text' value={title} onChange={handleTitleChange} required />
          </label>

          <label>
            Poll Due Date:
            <input type='date' value={dueDate} onChange={handleDueDateChange} required />
          </label>

          <div className='options-container'>
            <label>Options:</label>
            {options.map((option, index) => (
              <div className='option-input' key={index}>
                <input
                  type='text'
                  value={option}
                  onChange={e => handleOptionChange(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                  required
                />
              </div>
            ))}
            <button type='button' className='add-option-button' onClick={handleAddOption}>
              Add Option
            </button>
          </div>

          <button type='submit' className='submit-button'>
            Create Poll
          </button>
        </form>
      </div>
    </>
  );
};

export default PollCreationPage;
