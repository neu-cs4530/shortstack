import useCommunityBreadcrumb from '../../../../../hooks/useCommunityBreadcrumb';
import { CommunitySubpageType } from '../../../../../types';
import './communityBreadcrumb.css';

/**
 * Represents the community breadcrumb component. Displays the hierarchy of pages navigated from to reach a
 * community-related sub-page (article, question, poll, etc.).
 * @param communityID - The ID of the community the user is in
 * @param subPageType - The type of subpage of a community the user is in
 * @param currentPageTitle - The title of the subpage the user is in that will be displayed as the last element of the breadcrumb
 */
const CommunityBreadcrumb = ({
  communityID,
  objectID,
  subPageType,
  currentPageTitle,
  styleOverride,
}: {
  communityID?: string;
  objectID?: string;
  subPageType: CommunitySubpageType;
  currentPageTitle?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  styleOverride?: any;
}) => {
  const { handleNavigateToCommunity, handleNavigateToCommunityList, communityTitle } =
    useCommunityBreadcrumb({
      communityID,
      objectID,
      subPageType,
    });

  return (
    communityTitle && (
      <div className='breadcrumb-container' style={styleOverride}>
        <h3 className='breadcrumb-link' onClick={handleNavigateToCommunityList}>
          Communities
        </h3>
        <h3>&gt;</h3>
        {subPageType === 'Community' ? (
          <h3>{communityTitle}</h3>
        ) : (
          <>
            <h3 className='breadcrumb-link' onClick={handleNavigateToCommunity}>
              {communityTitle}
            </h3>
            <h3>&gt;</h3>
            <h3 className='breadcrumb-label'>{currentPageTitle || subPageType}</h3>
          </>
        )}
      </div>
    )
  );
};

export default CommunityBreadcrumb;
