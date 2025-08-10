import {
  __commonJS
} from "./chunk-3OV72XIM.js";

// node_modules/node-fetch/browser.js
var require_browser = __commonJS({
  "node_modules/node-fetch/browser.js"(exports, module2) {
    "use strict";
    var getGlobal = function() {
      if (typeof self !== "undefined") {
        return self;
      }
      if (typeof window !== "undefined") {
        return window;
      }
      if (typeof global !== "undefined") {
        return global;
      }
      throw new Error("unable to locate global object");
    };
    var globalObject = getGlobal();
    module2.exports = exports = globalObject.fetch;
    if (globalObject.fetch) {
      exports.default = globalObject.fetch.bind(globalObject);
    }
    exports.Headers = globalObject.Headers;
    exports.Request = globalObject.Request;
    exports.Response = globalObject.Response;
  }
});

// browser-external:crypto
var require_crypto = __commonJS({
  "browser-external:crypto"(exports, module2) {
    module2.exports = Object.create(new Proxy({}, {
      get(_, key) {
        if (key !== "__esModule" && key !== "__proto__" && key !== "constructor" && key !== "splice") {
          console.warn(`Module "crypto" has been externalized for browser compatibility. Cannot access "crypto.${key}" in client code. See https://vite.dev/guide/troubleshooting.html#module-externalized-for-browser-compatibility for more details.`);
        }
      }
    }));
  }
});

// browser-external:util
var require_util = __commonJS({
  "browser-external:util"(exports, module2) {
    module2.exports = Object.create(new Proxy({}, {
      get(_, key) {
        if (key !== "__esModule" && key !== "__proto__" && key !== "constructor" && key !== "splice") {
          console.warn(`Module "util" has been externalized for browser compatibility. Cannot access "util.${key}" in client code. See https://vite.dev/guide/troubleshooting.html#module-externalized-for-browser-compatibility for more details.`);
        }
      }
    }));
  }
});

// node_modules/dropbox/es/src/constants.js
var RPC = "rpc";
var UPLOAD = "upload";
var DOWNLOAD = "download";
var APP_AUTH = "app";
var USER_AUTH = "user";
var TEAM_AUTH = "team";
var NO_AUTH = "noauth";
var COOKIE = "cookie";
var DEFAULT_API_DOMAIN = "dropboxapi.com";
var DEFAULT_DOMAIN = "dropbox.com";
var TEST_DOMAIN_MAPPINGS = {
  api: "api",
  notify: "bolt",
  content: "api-content"
};

// node_modules/dropbox/es/lib/routes.js
var routes = {};
routes.accountSetProfilePhoto = function(arg) {
  return this.request("account/set_profile_photo", arg, "user", "api", "rpc", "account_info.write");
};
routes.authTokenFromOauth1 = function(arg) {
  return this.request("auth/token/from_oauth1", arg, "app", "api", "rpc", null);
};
routes.authTokenRevoke = function() {
  return this.request("auth/token/revoke", null, "user", "api", "rpc", null);
};
routes.checkApp = function(arg) {
  return this.request("check/app", arg, "app", "api", "rpc", null);
};
routes.checkUser = function(arg) {
  return this.request("check/user", arg, "user", "api", "rpc", "account_info.read");
};
routes.contactsDeleteManualContacts = function() {
  return this.request("contacts/delete_manual_contacts", null, "user", "api", "rpc", "contacts.write");
};
routes.contactsDeleteManualContactsBatch = function(arg) {
  return this.request("contacts/delete_manual_contacts_batch", arg, "user", "api", "rpc", "contacts.write");
};
routes.filePropertiesPropertiesAdd = function(arg) {
  return this.request("file_properties/properties/add", arg, "user", "api", "rpc", "files.metadata.write");
};
routes.filePropertiesPropertiesOverwrite = function(arg) {
  return this.request("file_properties/properties/overwrite", arg, "user", "api", "rpc", "files.metadata.write");
};
routes.filePropertiesPropertiesRemove = function(arg) {
  return this.request("file_properties/properties/remove", arg, "user", "api", "rpc", "files.metadata.write");
};
routes.filePropertiesPropertiesSearch = function(arg) {
  return this.request("file_properties/properties/search", arg, "user", "api", "rpc", "files.metadata.read");
};
routes.filePropertiesPropertiesSearchContinue = function(arg) {
  return this.request("file_properties/properties/search/continue", arg, "user", "api", "rpc", "files.metadata.read");
};
routes.filePropertiesPropertiesUpdate = function(arg) {
  return this.request("file_properties/properties/update", arg, "user", "api", "rpc", "files.metadata.write");
};
routes.filePropertiesTemplatesAddForTeam = function(arg) {
  return this.request("file_properties/templates/add_for_team", arg, "team", "api", "rpc", "files.team_metadata.write");
};
routes.filePropertiesTemplatesAddForUser = function(arg) {
  return this.request("file_properties/templates/add_for_user", arg, "user", "api", "rpc", "files.metadata.write");
};
routes.filePropertiesTemplatesGetForTeam = function(arg) {
  return this.request("file_properties/templates/get_for_team", arg, "team", "api", "rpc", "files.team_metadata.write");
};
routes.filePropertiesTemplatesGetForUser = function(arg) {
  return this.request("file_properties/templates/get_for_user", arg, "user", "api", "rpc", "files.metadata.read");
};
routes.filePropertiesTemplatesListForTeam = function() {
  return this.request("file_properties/templates/list_for_team", null, "team", "api", "rpc", "files.team_metadata.write");
};
routes.filePropertiesTemplatesListForUser = function() {
  return this.request("file_properties/templates/list_for_user", null, "user", "api", "rpc", "files.metadata.read");
};
routes.filePropertiesTemplatesRemoveForTeam = function(arg) {
  return this.request("file_properties/templates/remove_for_team", arg, "team", "api", "rpc", "files.team_metadata.write");
};
routes.filePropertiesTemplatesRemoveForUser = function(arg) {
  return this.request("file_properties/templates/remove_for_user", arg, "user", "api", "rpc", "files.metadata.write");
};
routes.filePropertiesTemplatesUpdateForTeam = function(arg) {
  return this.request("file_properties/templates/update_for_team", arg, "team", "api", "rpc", "files.team_metadata.write");
};
routes.filePropertiesTemplatesUpdateForUser = function(arg) {
  return this.request("file_properties/templates/update_for_user", arg, "user", "api", "rpc", "files.metadata.write");
};
routes.fileRequestsCount = function() {
  return this.request("file_requests/count", null, "user", "api", "rpc", "file_requests.read");
};
routes.fileRequestsCreate = function(arg) {
  return this.request("file_requests/create", arg, "user", "api", "rpc", "file_requests.write");
};
routes.fileRequestsDelete = function(arg) {
  return this.request("file_requests/delete", arg, "user", "api", "rpc", "file_requests.write");
};
routes.fileRequestsDeleteAllClosed = function() {
  return this.request("file_requests/delete_all_closed", null, "user", "api", "rpc", "file_requests.write");
};
routes.fileRequestsGet = function(arg) {
  return this.request("file_requests/get", arg, "user", "api", "rpc", "file_requests.read");
};
routes.fileRequestsListV2 = function(arg) {
  return this.request("file_requests/list_v2", arg, "user", "api", "rpc", "file_requests.read");
};
routes.fileRequestsList = function() {
  return this.request("file_requests/list", null, "user", "api", "rpc", "file_requests.read");
};
routes.fileRequestsListContinue = function(arg) {
  return this.request("file_requests/list/continue", arg, "user", "api", "rpc", "file_requests.read");
};
routes.fileRequestsUpdate = function(arg) {
  return this.request("file_requests/update", arg, "user", "api", "rpc", "file_requests.write");
};
routes.filesAlphaGetMetadata = function(arg) {
  return this.request("files/alpha/get_metadata", arg, "user", "api", "rpc", "files.metadata.read");
};
routes.filesAlphaUpload = function(arg) {
  return this.request("files/alpha/upload", arg, "user", "content", "upload", "files.content.write");
};
routes.filesCopyV2 = function(arg) {
  return this.request("files/copy_v2", arg, "user", "api", "rpc", "files.content.write");
};
routes.filesCopy = function(arg) {
  return this.request("files/copy", arg, "user", "api", "rpc", "files.content.write");
};
routes.filesCopyBatchV2 = function(arg) {
  return this.request("files/copy_batch_v2", arg, "user", "api", "rpc", "files.content.write");
};
routes.filesCopyBatch = function(arg) {
  return this.request("files/copy_batch", arg, "user", "api", "rpc", "files.content.write");
};
routes.filesCopyBatchCheckV2 = function(arg) {
  return this.request("files/copy_batch/check_v2", arg, "user", "api", "rpc", "files.content.write");
};
routes.filesCopyBatchCheck = function(arg) {
  return this.request("files/copy_batch/check", arg, "user", "api", "rpc", "files.content.write");
};
routes.filesCopyReferenceGet = function(arg) {
  return this.request("files/copy_reference/get", arg, "user", "api", "rpc", "files.content.write");
};
routes.filesCopyReferenceSave = function(arg) {
  return this.request("files/copy_reference/save", arg, "user", "api", "rpc", "files.content.write");
};
routes.filesCreateFolderV2 = function(arg) {
  return this.request("files/create_folder_v2", arg, "user", "api", "rpc", "files.content.write");
};
routes.filesCreateFolder = function(arg) {
  return this.request("files/create_folder", arg, "user", "api", "rpc", "files.content.write");
};
routes.filesCreateFolderBatch = function(arg) {
  return this.request("files/create_folder_batch", arg, "user", "api", "rpc", "files.content.write");
};
routes.filesCreateFolderBatchCheck = function(arg) {
  return this.request("files/create_folder_batch/check", arg, "user", "api", "rpc", "files.content.write");
};
routes.filesDeleteV2 = function(arg) {
  return this.request("files/delete_v2", arg, "user", "api", "rpc", "files.content.write");
};
routes.filesDelete = function(arg) {
  return this.request("files/delete", arg, "user", "api", "rpc", "files.content.write");
};
routes.filesDeleteBatch = function(arg) {
  return this.request("files/delete_batch", arg, "user", "api", "rpc", "files.content.write");
};
routes.filesDeleteBatchCheck = function(arg) {
  return this.request("files/delete_batch/check", arg, "user", "api", "rpc", "files.content.write");
};
routes.filesDownload = function(arg) {
  return this.request("files/download", arg, "user", "content", "download", "files.content.read");
};
routes.filesDownloadZip = function(arg) {
  return this.request("files/download_zip", arg, "user", "content", "download", "files.content.read");
};
routes.filesExport = function(arg) {
  return this.request("files/export", arg, "user", "content", "download", "files.content.read");
};
routes.filesGetFileLockBatch = function(arg) {
  return this.request("files/get_file_lock_batch", arg, "user", "api", "rpc", "files.content.read");
};
routes.filesGetMetadata = function(arg) {
  return this.request("files/get_metadata", arg, "user", "api", "rpc", "files.metadata.read");
};
routes.filesGetPreview = function(arg) {
  return this.request("files/get_preview", arg, "user", "content", "download", "files.content.read");
};
routes.filesGetTemporaryLink = function(arg) {
  return this.request("files/get_temporary_link", arg, "user", "api", "rpc", "files.content.read");
};
routes.filesGetTemporaryUploadLink = function(arg) {
  return this.request("files/get_temporary_upload_link", arg, "user", "api", "rpc", "files.content.write");
};
routes.filesGetThumbnail = function(arg) {
  return this.request("files/get_thumbnail", arg, "user", "content", "download", "files.content.read");
};
routes.filesGetThumbnailV2 = function(arg) {
  return this.request("files/get_thumbnail_v2", arg, "app, user", "content", "download", "files.content.read");
};
routes.filesGetThumbnailBatch = function(arg) {
  return this.request("files/get_thumbnail_batch", arg, "user", "content", "rpc", "files.content.read");
};
routes.filesListFolder = function(arg) {
  return this.request("files/list_folder", arg, "app, user", "api", "rpc", "files.metadata.read");
};
routes.filesListFolderContinue = function(arg) {
  return this.request("files/list_folder/continue", arg, "app, user", "api", "rpc", "files.metadata.read");
};
routes.filesListFolderGetLatestCursor = function(arg) {
  return this.request("files/list_folder/get_latest_cursor", arg, "user", "api", "rpc", "files.metadata.read");
};
routes.filesListFolderLongpoll = function(arg) {
  return this.request("files/list_folder/longpoll", arg, "noauth", "notify", "rpc", "files.metadata.read");
};
routes.filesListRevisions = function(arg) {
  return this.request("files/list_revisions", arg, "user", "api", "rpc", "files.metadata.read");
};
routes.filesLockFileBatch = function(arg) {
  return this.request("files/lock_file_batch", arg, "user", "api", "rpc", "files.content.write");
};
routes.filesMoveV2 = function(arg) {
  return this.request("files/move_v2", arg, "user", "api", "rpc", "files.content.write");
};
routes.filesMove = function(arg) {
  return this.request("files/move", arg, "user", "api", "rpc", "files.content.write");
};
routes.filesMoveBatchV2 = function(arg) {
  return this.request("files/move_batch_v2", arg, "user", "api", "rpc", "files.content.write");
};
routes.filesMoveBatch = function(arg) {
  return this.request("files/move_batch", arg, "user", "api", "rpc", "files.content.write");
};
routes.filesMoveBatchCheckV2 = function(arg) {
  return this.request("files/move_batch/check_v2", arg, "user", "api", "rpc", "files.content.write");
};
routes.filesMoveBatchCheck = function(arg) {
  return this.request("files/move_batch/check", arg, "user", "api", "rpc", "files.content.write");
};
routes.filesPaperCreate = function(arg) {
  return this.request("files/paper/create", arg, "user", "api", "upload", "files.content.write");
};
routes.filesPaperUpdate = function(arg) {
  return this.request("files/paper/update", arg, "user", "api", "upload", "files.content.write");
};
routes.filesPermanentlyDelete = function(arg) {
  return this.request("files/permanently_delete", arg, "user", "api", "rpc", "files.permanent_delete");
};
routes.filesPropertiesAdd = function(arg) {
  return this.request("files/properties/add", arg, "user", "api", "rpc", "files.metadata.write");
};
routes.filesPropertiesOverwrite = function(arg) {
  return this.request("files/properties/overwrite", arg, "user", "api", "rpc", "files.metadata.write");
};
routes.filesPropertiesRemove = function(arg) {
  return this.request("files/properties/remove", arg, "user", "api", "rpc", "files.metadata.write");
};
routes.filesPropertiesTemplateGet = function(arg) {
  return this.request("files/properties/template/get", arg, "user", "api", "rpc", "files.metadata.read");
};
routes.filesPropertiesTemplateList = function() {
  return this.request("files/properties/template/list", null, "user", "api", "rpc", "files.metadata.read");
};
routes.filesPropertiesUpdate = function(arg) {
  return this.request("files/properties/update", arg, "user", "api", "rpc", "files.metadata.write");
};
routes.filesRestore = function(arg) {
  return this.request("files/restore", arg, "user", "api", "rpc", "files.content.write");
};
routes.filesSaveUrl = function(arg) {
  return this.request("files/save_url", arg, "user", "api", "rpc", "files.content.write");
};
routes.filesSaveUrlCheckJobStatus = function(arg) {
  return this.request("files/save_url/check_job_status", arg, "user", "api", "rpc", "files.content.write");
};
routes.filesSearch = function(arg) {
  return this.request("files/search", arg, "user", "api", "rpc", "files.metadata.read");
};
routes.filesSearchV2 = function(arg) {
  return this.request("files/search_v2", arg, "user", "api", "rpc", "files.metadata.read");
};
routes.filesSearchContinueV2 = function(arg) {
  return this.request("files/search/continue_v2", arg, "user", "api", "rpc", "files.metadata.read");
};
routes.filesTagsAdd = function(arg) {
  return this.request("files/tags/add", arg, "user", "api", "rpc", "files.metadata.write");
};
routes.filesTagsGet = function(arg) {
  return this.request("files/tags/get", arg, "user", "api", "rpc", "files.metadata.read");
};
routes.filesTagsRemove = function(arg) {
  return this.request("files/tags/remove", arg, "user", "api", "rpc", "files.metadata.write");
};
routes.filesUnlockFileBatch = function(arg) {
  return this.request("files/unlock_file_batch", arg, "user", "api", "rpc", "files.content.write");
};
routes.filesUpload = function(arg) {
  return this.request("files/upload", arg, "user", "content", "upload", "files.content.write");
};
routes.filesUploadSessionAppendV2 = function(arg) {
  return this.request("files/upload_session/append_v2", arg, "user", "content", "upload", "files.content.write");
};
routes.filesUploadSessionAppend = function(arg) {
  return this.request("files/upload_session/append", arg, "user", "content", "upload", "files.content.write");
};
routes.filesUploadSessionFinish = function(arg) {
  return this.request("files/upload_session/finish", arg, "user", "content", "upload", "files.content.write");
};
routes.filesUploadSessionFinishBatch = function(arg) {
  return this.request("files/upload_session/finish_batch", arg, "user", "api", "rpc", "files.content.write");
};
routes.filesUploadSessionFinishBatchV2 = function(arg) {
  return this.request("files/upload_session/finish_batch_v2", arg, "user", "api", "rpc", "files.content.write");
};
routes.filesUploadSessionFinishBatchCheck = function(arg) {
  return this.request("files/upload_session/finish_batch/check", arg, "user", "api", "rpc", "files.content.write");
};
routes.filesUploadSessionStart = function(arg) {
  return this.request("files/upload_session/start", arg, "user", "content", "upload", "files.content.write");
};
routes.filesUploadSessionStartBatch = function(arg) {
  return this.request("files/upload_session/start_batch", arg, "user", "api", "rpc", "files.content.write");
};
routes.openidUserinfo = function(arg) {
  return this.request("openid/userinfo", arg, "user", "api", "rpc", "openid");
};
routes.paperDocsArchive = function(arg) {
  return this.request("paper/docs/archive", arg, "user", "api", "rpc", "files.content.write");
};
routes.paperDocsCreate = function(arg) {
  return this.request("paper/docs/create", arg, "user", "api", "upload", "files.content.write");
};
routes.paperDocsDownload = function(arg) {
  return this.request("paper/docs/download", arg, "user", "api", "download", "files.content.read");
};
routes.paperDocsFolderUsersList = function(arg) {
  return this.request("paper/docs/folder_users/list", arg, "user", "api", "rpc", "sharing.read");
};
routes.paperDocsFolderUsersListContinue = function(arg) {
  return this.request("paper/docs/folder_users/list/continue", arg, "user", "api", "rpc", "sharing.read");
};
routes.paperDocsGetFolderInfo = function(arg) {
  return this.request("paper/docs/get_folder_info", arg, "user", "api", "rpc", "sharing.read");
};
routes.paperDocsList = function(arg) {
  return this.request("paper/docs/list", arg, "user", "api", "rpc", "files.metadata.read");
};
routes.paperDocsListContinue = function(arg) {
  return this.request("paper/docs/list/continue", arg, "user", "api", "rpc", "files.metadata.read");
};
routes.paperDocsPermanentlyDelete = function(arg) {
  return this.request("paper/docs/permanently_delete", arg, "user", "api", "rpc", "files.permanent_delete");
};
routes.paperDocsSharingPolicyGet = function(arg) {
  return this.request("paper/docs/sharing_policy/get", arg, "user", "api", "rpc", "sharing.read");
};
routes.paperDocsSharingPolicySet = function(arg) {
  return this.request("paper/docs/sharing_policy/set", arg, "user", "api", "rpc", "sharing.write");
};
routes.paperDocsUpdate = function(arg) {
  return this.request("paper/docs/update", arg, "user", "api", "upload", "files.content.write");
};
routes.paperDocsUsersAdd = function(arg) {
  return this.request("paper/docs/users/add", arg, "user", "api", "rpc", "sharing.write");
};
routes.paperDocsUsersList = function(arg) {
  return this.request("paper/docs/users/list", arg, "user", "api", "rpc", "sharing.read");
};
routes.paperDocsUsersListContinue = function(arg) {
  return this.request("paper/docs/users/list/continue", arg, "user", "api", "rpc", "sharing.read");
};
routes.paperDocsUsersRemove = function(arg) {
  return this.request("paper/docs/users/remove", arg, "user", "api", "rpc", "sharing.write");
};
routes.paperFoldersCreate = function(arg) {
  return this.request("paper/folders/create", arg, "user", "api", "rpc", "files.content.write");
};
routes.sharingAddFileMember = function(arg) {
  return this.request("sharing/add_file_member", arg, "user", "api", "rpc", "sharing.write");
};
routes.sharingAddFolderMember = function(arg) {
  return this.request("sharing/add_folder_member", arg, "user", "api", "rpc", "sharing.write");
};
routes.sharingCheckJobStatus = function(arg) {
  return this.request("sharing/check_job_status", arg, "user", "api", "rpc", "sharing.write");
};
routes.sharingCheckRemoveMemberJobStatus = function(arg) {
  return this.request("sharing/check_remove_member_job_status", arg, "user", "api", "rpc", "sharing.write");
};
routes.sharingCheckShareJobStatus = function(arg) {
  return this.request("sharing/check_share_job_status", arg, "user", "api", "rpc", "sharing.write");
};
routes.sharingCreateSharedLink = function(arg) {
  return this.request("sharing/create_shared_link", arg, "user", "api", "rpc", "sharing.write");
};
routes.sharingCreateSharedLinkWithSettings = function(arg) {
  return this.request("sharing/create_shared_link_with_settings", arg, "user", "api", "rpc", "sharing.write");
};
routes.sharingGetFileMetadata = function(arg) {
  return this.request("sharing/get_file_metadata", arg, "user", "api", "rpc", "sharing.read");
};
routes.sharingGetFileMetadataBatch = function(arg) {
  return this.request("sharing/get_file_metadata/batch", arg, "user", "api", "rpc", "sharing.read");
};
routes.sharingGetFolderMetadata = function(arg) {
  return this.request("sharing/get_folder_metadata", arg, "user", "api", "rpc", "sharing.read");
};
routes.sharingGetSharedLinkFile = function(arg) {
  return this.request("sharing/get_shared_link_file", arg, "user", "content", "download", "sharing.read");
};
routes.sharingGetSharedLinkMetadata = function(arg) {
  return this.request("sharing/get_shared_link_metadata", arg, "app, user", "api", "rpc", "sharing.read");
};
routes.sharingGetSharedLinks = function(arg) {
  return this.request("sharing/get_shared_links", arg, "user", "api", "rpc", "sharing.read");
};
routes.sharingListFileMembers = function(arg) {
  return this.request("sharing/list_file_members", arg, "user", "api", "rpc", "sharing.read");
};
routes.sharingListFileMembersBatch = function(arg) {
  return this.request("sharing/list_file_members/batch", arg, "user", "api", "rpc", "sharing.read");
};
routes.sharingListFileMembersContinue = function(arg) {
  return this.request("sharing/list_file_members/continue", arg, "user", "api", "rpc", "sharing.read");
};
routes.sharingListFolderMembers = function(arg) {
  return this.request("sharing/list_folder_members", arg, "user", "api", "rpc", "sharing.read");
};
routes.sharingListFolderMembersContinue = function(arg) {
  return this.request("sharing/list_folder_members/continue", arg, "user", "api", "rpc", "sharing.read");
};
routes.sharingListFolders = function(arg) {
  return this.request("sharing/list_folders", arg, "user", "api", "rpc", "sharing.read");
};
routes.sharingListFoldersContinue = function(arg) {
  return this.request("sharing/list_folders/continue", arg, "user", "api", "rpc", "sharing.read");
};
routes.sharingListMountableFolders = function(arg) {
  return this.request("sharing/list_mountable_folders", arg, "user", "api", "rpc", "sharing.read");
};
routes.sharingListMountableFoldersContinue = function(arg) {
  return this.request("sharing/list_mountable_folders/continue", arg, "user", "api", "rpc", "sharing.read");
};
routes.sharingListReceivedFiles = function(arg) {
  return this.request("sharing/list_received_files", arg, "user", "api", "rpc", "sharing.read");
};
routes.sharingListReceivedFilesContinue = function(arg) {
  return this.request("sharing/list_received_files/continue", arg, "user", "api", "rpc", "sharing.read");
};
routes.sharingListSharedLinks = function(arg) {
  return this.request("sharing/list_shared_links", arg, "user", "api", "rpc", "sharing.read");
};
routes.sharingModifySharedLinkSettings = function(arg) {
  return this.request("sharing/modify_shared_link_settings", arg, "user", "api", "rpc", "sharing.write");
};
routes.sharingMountFolder = function(arg) {
  return this.request("sharing/mount_folder", arg, "user", "api", "rpc", "sharing.write");
};
routes.sharingRelinquishFileMembership = function(arg) {
  return this.request("sharing/relinquish_file_membership", arg, "user", "api", "rpc", "sharing.write");
};
routes.sharingRelinquishFolderMembership = function(arg) {
  return this.request("sharing/relinquish_folder_membership", arg, "user", "api", "rpc", "sharing.write");
};
routes.sharingRemoveFileMember = function(arg) {
  return this.request("sharing/remove_file_member", arg, "user", "api", "rpc", "sharing.write");
};
routes.sharingRemoveFileMember2 = function(arg) {
  return this.request("sharing/remove_file_member_2", arg, "user", "api", "rpc", "sharing.write");
};
routes.sharingRemoveFolderMember = function(arg) {
  return this.request("sharing/remove_folder_member", arg, "user", "api", "rpc", "sharing.write");
};
routes.sharingRevokeSharedLink = function(arg) {
  return this.request("sharing/revoke_shared_link", arg, "user", "api", "rpc", "sharing.write");
};
routes.sharingSetAccessInheritance = function(arg) {
  return this.request("sharing/set_access_inheritance", arg, "user", "api", "rpc", "sharing.write");
};
routes.sharingShareFolder = function(arg) {
  return this.request("sharing/share_folder", arg, "user", "api", "rpc", "sharing.write");
};
routes.sharingTransferFolder = function(arg) {
  return this.request("sharing/transfer_folder", arg, "user", "api", "rpc", "sharing.write");
};
routes.sharingUnmountFolder = function(arg) {
  return this.request("sharing/unmount_folder", arg, "user", "api", "rpc", "sharing.write");
};
routes.sharingUnshareFile = function(arg) {
  return this.request("sharing/unshare_file", arg, "user", "api", "rpc", "sharing.write");
};
routes.sharingUnshareFolder = function(arg) {
  return this.request("sharing/unshare_folder", arg, "user", "api", "rpc", "sharing.write");
};
routes.sharingUpdateFileMember = function(arg) {
  return this.request("sharing/update_file_member", arg, "user", "api", "rpc", "sharing.write");
};
routes.sharingUpdateFolderMember = function(arg) {
  return this.request("sharing/update_folder_member", arg, "user", "api", "rpc", "sharing.write");
};
routes.sharingUpdateFolderPolicy = function(arg) {
  return this.request("sharing/update_folder_policy", arg, "user", "api", "rpc", "sharing.write");
};
routes.teamDevicesListMemberDevices = function(arg) {
  return this.request("team/devices/list_member_devices", arg, "team", "api", "rpc", "sessions.list");
};
routes.teamDevicesListMembersDevices = function(arg) {
  return this.request("team/devices/list_members_devices", arg, "team", "api", "rpc", "sessions.list");
};
routes.teamDevicesListTeamDevices = function(arg) {
  return this.request("team/devices/list_team_devices", arg, "team", "api", "rpc", "sessions.list");
};
routes.teamDevicesRevokeDeviceSession = function(arg) {
  return this.request("team/devices/revoke_device_session", arg, "team", "api", "rpc", "sessions.modify");
};
routes.teamDevicesRevokeDeviceSessionBatch = function(arg) {
  return this.request("team/devices/revoke_device_session_batch", arg, "team", "api", "rpc", "sessions.modify");
};
routes.teamFeaturesGetValues = function(arg) {
  return this.request("team/features/get_values", arg, "team", "api", "rpc", "team_info.read");
};
routes.teamGetInfo = function() {
  return this.request("team/get_info", null, "team", "api", "rpc", "team_info.read");
};
routes.teamGroupsCreate = function(arg) {
  return this.request("team/groups/create", arg, "team", "api", "rpc", "groups.write");
};
routes.teamGroupsDelete = function(arg) {
  return this.request("team/groups/delete", arg, "team", "api", "rpc", "groups.write");
};
routes.teamGroupsGetInfo = function(arg) {
  return this.request("team/groups/get_info", arg, "team", "api", "rpc", "groups.read");
};
routes.teamGroupsJobStatusGet = function(arg) {
  return this.request("team/groups/job_status/get", arg, "team", "api", "rpc", "groups.write");
};
routes.teamGroupsList = function(arg) {
  return this.request("team/groups/list", arg, "team", "api", "rpc", "groups.read");
};
routes.teamGroupsListContinue = function(arg) {
  return this.request("team/groups/list/continue", arg, "team", "api", "rpc", "groups.read");
};
routes.teamGroupsMembersAdd = function(arg) {
  return this.request("team/groups/members/add", arg, "team", "api", "rpc", "groups.write");
};
routes.teamGroupsMembersList = function(arg) {
  return this.request("team/groups/members/list", arg, "team", "api", "rpc", "groups.read");
};
routes.teamGroupsMembersListContinue = function(arg) {
  return this.request("team/groups/members/list/continue", arg, "team", "api", "rpc", "groups.read");
};
routes.teamGroupsMembersRemove = function(arg) {
  return this.request("team/groups/members/remove", arg, "team", "api", "rpc", "groups.write");
};
routes.teamGroupsMembersSetAccessType = function(arg) {
  return this.request("team/groups/members/set_access_type", arg, "team", "api", "rpc", "groups.write");
};
routes.teamGroupsUpdate = function(arg) {
  return this.request("team/groups/update", arg, "team", "api", "rpc", "groups.write");
};
routes.teamLegalHoldsCreatePolicy = function(arg) {
  return this.request("team/legal_holds/create_policy", arg, "team", "api", "rpc", "team_data.governance.write");
};
routes.teamLegalHoldsGetPolicy = function(arg) {
  return this.request("team/legal_holds/get_policy", arg, "team", "api", "rpc", "team_data.governance.write");
};
routes.teamLegalHoldsListHeldRevisions = function(arg) {
  return this.request("team/legal_holds/list_held_revisions", arg, "team", "api", "rpc", "team_data.governance.write");
};
routes.teamLegalHoldsListHeldRevisionsContinue = function(arg) {
  return this.request("team/legal_holds/list_held_revisions_continue", arg, "team", "api", "rpc", "team_data.governance.write");
};
routes.teamLegalHoldsListPolicies = function(arg) {
  return this.request("team/legal_holds/list_policies", arg, "team", "api", "rpc", "team_data.governance.write");
};
routes.teamLegalHoldsReleasePolicy = function(arg) {
  return this.request("team/legal_holds/release_policy", arg, "team", "api", "rpc", "team_data.governance.write");
};
routes.teamLegalHoldsUpdatePolicy = function(arg) {
  return this.request("team/legal_holds/update_policy", arg, "team", "api", "rpc", "team_data.governance.write");
};
routes.teamLinkedAppsListMemberLinkedApps = function(arg) {
  return this.request("team/linked_apps/list_member_linked_apps", arg, "team", "api", "rpc", "sessions.list");
};
routes.teamLinkedAppsListMembersLinkedApps = function(arg) {
  return this.request("team/linked_apps/list_members_linked_apps", arg, "team", "api", "rpc", "sessions.list");
};
routes.teamLinkedAppsListTeamLinkedApps = function(arg) {
  return this.request("team/linked_apps/list_team_linked_apps", arg, "team", "api", "rpc", "sessions.list");
};
routes.teamLinkedAppsRevokeLinkedApp = function(arg) {
  return this.request("team/linked_apps/revoke_linked_app", arg, "team", "api", "rpc", "sessions.modify");
};
routes.teamLinkedAppsRevokeLinkedAppBatch = function(arg) {
  return this.request("team/linked_apps/revoke_linked_app_batch", arg, "team", "api", "rpc", "sessions.modify");
};
routes.teamMemberSpaceLimitsExcludedUsersAdd = function(arg) {
  return this.request("team/member_space_limits/excluded_users/add", arg, "team", "api", "rpc", "members.write");
};
routes.teamMemberSpaceLimitsExcludedUsersList = function(arg) {
  return this.request("team/member_space_limits/excluded_users/list", arg, "team", "api", "rpc", "members.read");
};
routes.teamMemberSpaceLimitsExcludedUsersListContinue = function(arg) {
  return this.request("team/member_space_limits/excluded_users/list/continue", arg, "team", "api", "rpc", "members.read");
};
routes.teamMemberSpaceLimitsExcludedUsersRemove = function(arg) {
  return this.request("team/member_space_limits/excluded_users/remove", arg, "team", "api", "rpc", "members.write");
};
routes.teamMemberSpaceLimitsGetCustomQuota = function(arg) {
  return this.request("team/member_space_limits/get_custom_quota", arg, "team", "api", "rpc", "members.read");
};
routes.teamMemberSpaceLimitsRemoveCustomQuota = function(arg) {
  return this.request("team/member_space_limits/remove_custom_quota", arg, "team", "api", "rpc", "members.write");
};
routes.teamMemberSpaceLimitsSetCustomQuota = function(arg) {
  return this.request("team/member_space_limits/set_custom_quota", arg, "team", "api", "rpc", "members.read");
};
routes.teamMembersAddV2 = function(arg) {
  return this.request("team/members/add_v2", arg, "team", "api", "rpc", "members.write");
};
routes.teamMembersAdd = function(arg) {
  return this.request("team/members/add", arg, "team", "api", "rpc", "members.write");
};
routes.teamMembersAddJobStatusGetV2 = function(arg) {
  return this.request("team/members/add/job_status/get_v2", arg, "team", "api", "rpc", "members.write");
};
routes.teamMembersAddJobStatusGet = function(arg) {
  return this.request("team/members/add/job_status/get", arg, "team", "api", "rpc", "members.write");
};
routes.teamMembersDeleteProfilePhotoV2 = function(arg) {
  return this.request("team/members/delete_profile_photo_v2", arg, "team", "api", "rpc", "members.write");
};
routes.teamMembersDeleteProfilePhoto = function(arg) {
  return this.request("team/members/delete_profile_photo", arg, "team", "api", "rpc", "members.write");
};
routes.teamMembersGetAvailableTeamMemberRoles = function() {
  return this.request("team/members/get_available_team_member_roles", null, "team", "api", "rpc", "members.read");
};
routes.teamMembersGetInfoV2 = function(arg) {
  return this.request("team/members/get_info_v2", arg, "team", "api", "rpc", "members.read");
};
routes.teamMembersGetInfo = function(arg) {
  return this.request("team/members/get_info", arg, "team", "api", "rpc", "members.read");
};
routes.teamMembersListV2 = function(arg) {
  return this.request("team/members/list_v2", arg, "team", "api", "rpc", "members.read");
};
routes.teamMembersList = function(arg) {
  return this.request("team/members/list", arg, "team", "api", "rpc", "members.read");
};
routes.teamMembersListContinueV2 = function(arg) {
  return this.request("team/members/list/continue_v2", arg, "team", "api", "rpc", "members.read");
};
routes.teamMembersListContinue = function(arg) {
  return this.request("team/members/list/continue", arg, "team", "api", "rpc", "members.read");
};
routes.teamMembersMoveFormerMemberFiles = function(arg) {
  return this.request("team/members/move_former_member_files", arg, "team", "api", "rpc", "members.write");
};
routes.teamMembersMoveFormerMemberFilesJobStatusCheck = function(arg) {
  return this.request("team/members/move_former_member_files/job_status/check", arg, "team", "api", "rpc", "members.write");
};
routes.teamMembersRecover = function(arg) {
  return this.request("team/members/recover", arg, "team", "api", "rpc", "members.delete");
};
routes.teamMembersRemove = function(arg) {
  return this.request("team/members/remove", arg, "team", "api", "rpc", "members.delete");
};
routes.teamMembersRemoveJobStatusGet = function(arg) {
  return this.request("team/members/remove/job_status/get", arg, "team", "api", "rpc", "members.delete");
};
routes.teamMembersSecondaryEmailsAdd = function(arg) {
  return this.request("team/members/secondary_emails/add", arg, "team", "api", "rpc", "members.write");
};
routes.teamMembersSecondaryEmailsDelete = function(arg) {
  return this.request("team/members/secondary_emails/delete", arg, "team", "api", "rpc", "members.write");
};
routes.teamMembersSecondaryEmailsResendVerificationEmails = function(arg) {
  return this.request("team/members/secondary_emails/resend_verification_emails", arg, "team", "api", "rpc", "members.write");
};
routes.teamMembersSendWelcomeEmail = function(arg) {
  return this.request("team/members/send_welcome_email", arg, "team", "api", "rpc", "members.write");
};
routes.teamMembersSetAdminPermissionsV2 = function(arg) {
  return this.request("team/members/set_admin_permissions_v2", arg, "team", "api", "rpc", "members.write");
};
routes.teamMembersSetAdminPermissions = function(arg) {
  return this.request("team/members/set_admin_permissions", arg, "team", "api", "rpc", "members.write");
};
routes.teamMembersSetProfileV2 = function(arg) {
  return this.request("team/members/set_profile_v2", arg, "team", "api", "rpc", "members.write");
};
routes.teamMembersSetProfile = function(arg) {
  return this.request("team/members/set_profile", arg, "team", "api", "rpc", "members.write");
};
routes.teamMembersSetProfilePhotoV2 = function(arg) {
  return this.request("team/members/set_profile_photo_v2", arg, "team", "api", "rpc", "members.write");
};
routes.teamMembersSetProfilePhoto = function(arg) {
  return this.request("team/members/set_profile_photo", arg, "team", "api", "rpc", "members.write");
};
routes.teamMembersSuspend = function(arg) {
  return this.request("team/members/suspend", arg, "team", "api", "rpc", "members.write");
};
routes.teamMembersUnsuspend = function(arg) {
  return this.request("team/members/unsuspend", arg, "team", "api", "rpc", "members.write");
};
routes.teamNamespacesList = function(arg) {
  return this.request("team/namespaces/list", arg, "team", "api", "rpc", "team_data.member");
};
routes.teamNamespacesListContinue = function(arg) {
  return this.request("team/namespaces/list/continue", arg, "team", "api", "rpc", "team_data.member");
};
routes.teamPropertiesTemplateAdd = function(arg) {
  return this.request("team/properties/template/add", arg, "team", "api", "rpc", "files.team_metadata.write");
};
routes.teamPropertiesTemplateGet = function(arg) {
  return this.request("team/properties/template/get", arg, "team", "api", "rpc", "files.team_metadata.write");
};
routes.teamPropertiesTemplateList = function() {
  return this.request("team/properties/template/list", null, "team", "api", "rpc", "files.team_metadata.write");
};
routes.teamPropertiesTemplateUpdate = function(arg) {
  return this.request("team/properties/template/update", arg, "team", "api", "rpc", "files.team_metadata.write");
};
routes.teamReportsGetActivity = function(arg) {
  return this.request("team/reports/get_activity", arg, "team", "api", "rpc", "team_info.read");
};
routes.teamReportsGetDevices = function(arg) {
  return this.request("team/reports/get_devices", arg, "team", "api", "rpc", "team_info.read");
};
routes.teamReportsGetMembership = function(arg) {
  return this.request("team/reports/get_membership", arg, "team", "api", "rpc", "team_info.read");
};
routes.teamReportsGetStorage = function(arg) {
  return this.request("team/reports/get_storage", arg, "team", "api", "rpc", "team_info.read");
};
routes.teamSharingAllowlistAdd = function(arg) {
  return this.request("team/sharing_allowlist/add", arg, "team", "api", "rpc", "team_info.write");
};
routes.teamSharingAllowlistList = function(arg) {
  return this.request("team/sharing_allowlist/list", arg, "team", "api", "rpc", "team_info.read");
};
routes.teamSharingAllowlistListContinue = function(arg) {
  return this.request("team/sharing_allowlist/list/continue", arg, "team", "api", "rpc", "team_info.read");
};
routes.teamSharingAllowlistRemove = function(arg) {
  return this.request("team/sharing_allowlist/remove", arg, "team", "api", "rpc", "team_info.write");
};
routes.teamTeamFolderActivate = function(arg) {
  return this.request("team/team_folder/activate", arg, "team", "api", "rpc", "team_data.content.write");
};
routes.teamTeamFolderArchive = function(arg) {
  return this.request("team/team_folder/archive", arg, "team", "api", "rpc", "team_data.content.write");
};
routes.teamTeamFolderArchiveCheck = function(arg) {
  return this.request("team/team_folder/archive/check", arg, "team", "api", "rpc", "team_data.content.write");
};
routes.teamTeamFolderCreate = function(arg) {
  return this.request("team/team_folder/create", arg, "team", "api", "rpc", "team_data.content.write");
};
routes.teamTeamFolderGetInfo = function(arg) {
  return this.request("team/team_folder/get_info", arg, "team", "api", "rpc", "team_data.content.read");
};
routes.teamTeamFolderList = function(arg) {
  return this.request("team/team_folder/list", arg, "team", "api", "rpc", "team_data.content.read");
};
routes.teamTeamFolderListContinue = function(arg) {
  return this.request("team/team_folder/list/continue", arg, "team", "api", "rpc", "team_data.content.read");
};
routes.teamTeamFolderPermanentlyDelete = function(arg) {
  return this.request("team/team_folder/permanently_delete", arg, "team", "api", "rpc", "team_data.content.write");
};
routes.teamTeamFolderRename = function(arg) {
  return this.request("team/team_folder/rename", arg, "team", "api", "rpc", "team_data.content.write");
};
routes.teamTeamFolderUpdateSyncSettings = function(arg) {
  return this.request("team/team_folder/update_sync_settings", arg, "team", "api", "rpc", "team_data.content.write");
};
routes.teamTokenGetAuthenticatedAdmin = function() {
  return this.request("team/token/get_authenticated_admin", null, "team", "api", "rpc", "team_info.read");
};
routes.teamLogGetEvents = function(arg) {
  return this.request("team_log/get_events", arg, "team", "api", "rpc", "events.read");
};
routes.teamLogGetEventsContinue = function(arg) {
  return this.request("team_log/get_events/continue", arg, "team", "api", "rpc", "events.read");
};
routes.usersFeaturesGetValues = function(arg) {
  return this.request("users/features/get_values", arg, "user", "api", "rpc", "account_info.read");
};
routes.usersGetAccount = function(arg) {
  return this.request("users/get_account", arg, "user", "api", "rpc", "sharing.read");
};
routes.usersGetAccountBatch = function(arg) {
  return this.request("users/get_account_batch", arg, "user", "api", "rpc", "sharing.read");
};
routes.usersGetCurrentAccount = function() {
  return this.request("users/get_current_account", null, "user", "api", "rpc", "account_info.read");
};
routes.usersGetSpaceUsage = function() {
  return this.request("users/get_space_usage", null, "user", "api", "rpc", "account_info.read");
};

// node_modules/dropbox/es/src/utils.js
function getSafeUnicode(c) {
  var unicode = "000".concat(c.charCodeAt(0).toString(16)).slice(-4);
  return "\\u".concat(unicode);
}
var baseApiUrl = function baseApiUrl2(subdomain) {
  var domain = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : DEFAULT_API_DOMAIN;
  var domainDelimiter = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : ".";
  if (!domainDelimiter) {
    return "https://".concat(domain, "/2/");
  }
  if (domain !== DEFAULT_API_DOMAIN && TEST_DOMAIN_MAPPINGS[subdomain] !== void 0) {
    subdomain = TEST_DOMAIN_MAPPINGS[subdomain];
    domainDelimiter = "-";
  }
  return "https://".concat(subdomain).concat(domainDelimiter).concat(domain, "/2/");
};
var OAuth2AuthorizationUrl = function OAuth2AuthorizationUrl2() {
  var domain = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : DEFAULT_DOMAIN;
  if (domain !== DEFAULT_DOMAIN) {
    domain = "meta-".concat(domain);
  }
  return "https://".concat(domain, "/oauth2/authorize");
};
var OAuth2TokenUrl = function OAuth2TokenUrl2() {
  var domain = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : DEFAULT_API_DOMAIN;
  var domainDelimiter = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : ".";
  var subdomain = "api";
  if (domain !== DEFAULT_API_DOMAIN) {
    subdomain = TEST_DOMAIN_MAPPINGS[subdomain];
    domainDelimiter = "-";
  }
  return "https://".concat(subdomain).concat(domainDelimiter).concat(domain, "/oauth2/token");
};
function httpHeaderSafeJson(args) {
  return JSON.stringify(args).replace(/[\u007f-\uffff]/g, getSafeUnicode);
}
function getTokenExpiresAtDate(expiresIn) {
  return new Date(Date.now() + expiresIn * 1e3);
}
function isWindowOrWorker() {
  return typeof WorkerGlobalScope !== "undefined" && self instanceof WorkerGlobalScope || typeof module === "undefined" || typeof window !== "undefined";
}
function isBrowserEnv() {
  return typeof window !== "undefined";
}
function isWorkerEnv() {
  return typeof WorkerGlobalScope !== "undefined" && self instanceof WorkerGlobalScope;
}
function createBrowserSafeString(toBeConverted) {
  var convertedString = toBeConverted.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
  return convertedString;
}

// node_modules/dropbox/es/src/error.js
function _typeof(obj) {
  "@babel/helpers - typeof";
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function _typeof2(obj2) {
      return typeof obj2;
    };
  } else {
    _typeof = function _typeof2(obj2) {
      return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
    };
  }
  return _typeof(obj);
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}
function _createSuper(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct();
  return function _createSuperInternal() {
    var Super = _getPrototypeOf(Derived), result;
    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf(this).constructor;
      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }
    return _possibleConstructorReturn(this, result);
  };
}
function _possibleConstructorReturn(self2, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  }
  return _assertThisInitialized(self2);
}
function _assertThisInitialized(self2) {
  if (self2 === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self2;
}
function _wrapNativeSuper(Class) {
  var _cache = typeof Map === "function" ? /* @__PURE__ */ new Map() : void 0;
  _wrapNativeSuper = function _wrapNativeSuper2(Class2) {
    if (Class2 === null || !_isNativeFunction(Class2)) return Class2;
    if (typeof Class2 !== "function") {
      throw new TypeError("Super expression must either be null or a function");
    }
    if (typeof _cache !== "undefined") {
      if (_cache.has(Class2)) return _cache.get(Class2);
      _cache.set(Class2, Wrapper);
    }
    function Wrapper() {
      return _construct(Class2, arguments, _getPrototypeOf(this).constructor);
    }
    Wrapper.prototype = Object.create(Class2.prototype, {
      constructor: {
        value: Wrapper,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    return _setPrototypeOf(Wrapper, Class2);
  };
  return _wrapNativeSuper(Class);
}
function _construct(Parent, args, Class) {
  if (_isNativeReflectConstruct()) {
    _construct = Reflect.construct;
  } else {
    _construct = function _construct2(Parent2, args2, Class2) {
      var a = [null];
      a.push.apply(a, args2);
      var Constructor = Function.bind.apply(Parent2, a);
      var instance = new Constructor();
      if (Class2) _setPrototypeOf(instance, Class2.prototype);
      return instance;
    };
  }
  return _construct.apply(null, arguments);
}
function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;
  try {
    Date.prototype.toString.call(Reflect.construct(Date, [], function() {
    }));
    return true;
  } catch (e) {
    return false;
  }
}
function _isNativeFunction(fn) {
  return Function.toString.call(fn).indexOf("[native code]") !== -1;
}
function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf2(o2, p2) {
    o2.__proto__ = p2;
    return o2;
  };
  return _setPrototypeOf(o, p);
}
function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf2(o2) {
    return o2.__proto__ || Object.getPrototypeOf(o2);
  };
  return _getPrototypeOf(o);
}
var DropboxResponseError = function(_Error) {
  _inherits(DropboxResponseError2, _Error);
  var _super = _createSuper(DropboxResponseError2);
  function DropboxResponseError2(status, headers, error) {
    var _this;
    _classCallCheck(this, DropboxResponseError2);
    _this = _super.call(this, "Response failed with a ".concat(status, " code"));
    _this.name = "DropboxResponseError";
    _this.status = status;
    _this.headers = headers;
    _this.error = error;
    return _this;
  }
  return DropboxResponseError2;
}(_wrapNativeSuper(Error));

// node_modules/dropbox/es/src/response.js
function _classCallCheck2(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
var DropboxResponse = function DropboxResponse2(status, headers, result) {
  _classCallCheck2(this, DropboxResponse2);
  this.status = status;
  this.headers = headers;
  this.result = result;
};
function throwAsError(res) {
  return res.text().then(function(data) {
    var errorObject;
    try {
      errorObject = JSON.parse(data);
    } catch (error) {
      errorObject = data;
    }
    throw new DropboxResponseError(res.status, res.headers, errorObject);
  });
}
function parseResponse(res) {
  if (!res.ok) {
    return throwAsError(res);
  }
  return res.text().then(function(data) {
    var responseObject;
    try {
      responseObject = JSON.parse(data);
    } catch (error) {
      responseObject = data;
    }
    return new DropboxResponse(res.status, res.headers, responseObject);
  });
}
function parseDownloadResponse(res) {
  if (!res.ok) {
    return throwAsError(res);
  }
  return new Promise(function(resolve) {
    if (isWindowOrWorker()) {
      res.blob().then(function(data) {
        return resolve(data);
      });
    } else {
      res.buffer().then(function(data) {
        return resolve(data);
      });
    }
  }).then(function(data) {
    var result = JSON.parse(res.headers.get("dropbox-api-result"));
    if (isWindowOrWorker()) {
      result.fileBlob = data;
    } else {
      result.fileBinary = data;
    }
    return new DropboxResponse(res.status, res.headers, result);
  });
}

// node_modules/dropbox/es/src/auth.js
function _classCallCheck3(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}
var fetch;
var crypto;
var Encoder;
var TokenExpirationBuffer = 300 * 1e3;
var PKCELength = 128;
var TokenAccessTypes = ["legacy", "offline", "online"];
var GrantTypes = ["code", "token"];
var IncludeGrantedScopes = ["none", "user", "team"];
var DropboxAuth = function() {
  function DropboxAuth2(options) {
    _classCallCheck3(this, DropboxAuth2);
    options = options || {};
    if (isBrowserEnv()) {
      fetch = window.fetch.bind(window);
      crypto = window.crypto || window.msCrypto;
    } else if (isWorkerEnv()) {
      fetch = self.fetch.bind(self);
      crypto = self.crypto;
    } else {
      fetch = require_browser();
      crypto = require_crypto();
    }
    if (typeof TextEncoder === "undefined") {
      Encoder = require_util().TextEncoder;
    } else {
      Encoder = TextEncoder;
    }
    this.fetch = options.fetch || fetch;
    this.accessToken = options.accessToken;
    this.accessTokenExpiresAt = options.accessTokenExpiresAt;
    this.refreshToken = options.refreshToken;
    this.clientId = options.clientId;
    this.clientSecret = options.clientSecret;
    this.domain = options.domain;
    this.domainDelimiter = options.domainDelimiter;
    this.customHeaders = options.customHeaders;
    this.dataOnBody = options.dataOnBody;
  }
  _createClass(DropboxAuth2, [{
    key: "setAccessToken",
    value: function setAccessToken(accessToken) {
      this.accessToken = accessToken;
    }
    /**
       * Get the access token
       * @returns {String} Access token
       */
  }, {
    key: "getAccessToken",
    value: function getAccessToken() {
      return this.accessToken;
    }
    /**
       * Set the client id, which is used to help gain an access token.
       * @arg {String} clientId - Your apps client id
       * @returns {undefined}
       */
  }, {
    key: "setClientId",
    value: function setClientId(clientId) {
      this.clientId = clientId;
    }
    /**
       * Get the client id
       * @returns {String} Client id
       */
  }, {
    key: "getClientId",
    value: function getClientId() {
      return this.clientId;
    }
    /**
       * Set the client secret
       * @arg {String} clientSecret - Your app's client secret
       * @returns {undefined}
       */
  }, {
    key: "setClientSecret",
    value: function setClientSecret(clientSecret) {
      this.clientSecret = clientSecret;
    }
    /**
       * Get the client secret
       * @returns {String} Client secret
       */
  }, {
    key: "getClientSecret",
    value: function getClientSecret() {
      return this.clientSecret;
    }
    /**
       * Gets the refresh token
       * @returns {String} Refresh token
       */
  }, {
    key: "getRefreshToken",
    value: function getRefreshToken() {
      return this.refreshToken;
    }
    /**
       * Sets the refresh token
       * @param refreshToken - A refresh token
       */
  }, {
    key: "setRefreshToken",
    value: function setRefreshToken(refreshToken) {
      this.refreshToken = refreshToken;
    }
    /**
       * Gets the access token's expiration date
       * @returns {Date} date of token expiration
       */
  }, {
    key: "getAccessTokenExpiresAt",
    value: function getAccessTokenExpiresAt() {
      return this.accessTokenExpiresAt;
    }
    /**
       * Sets the access token's expiration date
       * @param accessTokenExpiresAt - new expiration date
       */
  }, {
    key: "setAccessTokenExpiresAt",
    value: function setAccessTokenExpiresAt(accessTokenExpiresAt) {
      this.accessTokenExpiresAt = accessTokenExpiresAt;
    }
    /**
       * Sets the code verifier for PKCE flow
       * @param {String} codeVerifier - new code verifier
       */
  }, {
    key: "setCodeVerifier",
    value: function setCodeVerifier(codeVerifier) {
      this.codeVerifier = codeVerifier;
    }
    /**
       * Gets the code verifier for PKCE flow
       * @returns {String} - code verifier for PKCE
       */
  }, {
    key: "getCodeVerifier",
    value: function getCodeVerifier() {
      return this.codeVerifier;
    }
  }, {
    key: "generateCodeChallenge",
    value: function generateCodeChallenge() {
      var _this = this;
      var encoder = new Encoder();
      var codeData = encoder.encode(this.codeVerifier);
      var codeChallenge;
      if (isBrowserEnv() || isWorkerEnv()) {
        return crypto.subtle.digest("SHA-256", codeData).then(function(digestedHash2) {
          var base64String = btoa(String.fromCharCode.apply(null, new Uint8Array(digestedHash2)));
          codeChallenge = createBrowserSafeString(base64String).substr(0, 128);
          _this.codeChallenge = codeChallenge;
        });
      }
      var digestedHash = crypto.createHash("sha256").update(codeData).digest();
      codeChallenge = createBrowserSafeString(digestedHash);
      this.codeChallenge = codeChallenge;
      return Promise.resolve();
    }
  }, {
    key: "generatePKCECodes",
    value: function generatePKCECodes() {
      var codeVerifier;
      if (isBrowserEnv() || isWorkerEnv()) {
        var array = new Uint8Array(PKCELength);
        var randomValueArray = crypto.getRandomValues(array);
        var base64String = btoa(randomValueArray);
        codeVerifier = createBrowserSafeString(base64String).substr(0, 128);
      } else {
        var randomBytes = crypto.randomBytes(PKCELength);
        codeVerifier = createBrowserSafeString(randomBytes).substr(0, 128);
      }
      this.codeVerifier = codeVerifier;
      return this.generateCodeChallenge();
    }
    /**
       * Get a URL that can be used to authenticate users for the Dropbox API.
       * @arg {String} redirectUri - A URL to redirect the user to after
       * authenticating. This must be added to your app through the admin interface.
       * @arg {String} [state] - State that will be returned in the redirect URL to help
       * prevent cross site scripting attacks.
       * @arg {String} [authType] - auth type, defaults to 'token', other option is 'code'
       * @arg {String} [tokenAccessType] - type of token to request.  From the following:
       * null - creates a token with the app default (either legacy or online)
       * legacy - creates one long-lived token with no expiration
       * online - create one short-lived token with an expiration
       * offline - create one short-lived token with an expiration with a refresh token
       * @arg {Array<String>} [scope] - scopes to request for the grant
       * @arg {String} [includeGrantedScopes] - whether or not to include previously granted scopes.
       * From the following:
       * user - include user scopes in the grant
       * team - include team scopes in the grant
       * Note: if this user has never linked the app, include_granted_scopes must be None
       * @arg {boolean} [usePKCE] - Whether or not to use Sha256 based PKCE. PKCE should be only use
       * on client apps which doesn't call your server. It is less secure than non-PKCE flow but
       * can be used if you are unable to safely retrieve your app secret
       * @returns {Promise<String>} - Url to send user to for Dropbox API authentication
       * returned in a promise
       */
  }, {
    key: "getAuthenticationUrl",
    value: function getAuthenticationUrl(redirectUri, state) {
      var _this2 = this;
      var authType = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : "token";
      var tokenAccessType = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : null;
      var scope = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : null;
      var includeGrantedScopes = arguments.length > 5 && arguments[5] !== void 0 ? arguments[5] : "none";
      var usePKCE = arguments.length > 6 && arguments[6] !== void 0 ? arguments[6] : false;
      var clientId = this.getClientId();
      var baseUrl = OAuth2AuthorizationUrl(this.domain);
      if (!clientId) {
        throw new Error("A client id is required. You can set the client id using .setClientId().");
      }
      if (authType !== "code" && !redirectUri) {
        throw new Error("A redirect uri is required.");
      }
      if (!GrantTypes.includes(authType)) {
        throw new Error("Authorization type must be code or token");
      }
      if (tokenAccessType && !TokenAccessTypes.includes(tokenAccessType)) {
        throw new Error("Token Access Type must be legacy, offline, or online");
      }
      if (scope && !(scope instanceof Array)) {
        throw new Error("Scope must be an array of strings");
      }
      if (!IncludeGrantedScopes.includes(includeGrantedScopes)) {
        throw new Error("includeGrantedScopes must be none, user, or team");
      }
      var authUrl;
      if (authType === "code") {
        authUrl = "".concat(baseUrl, "?response_type=code&client_id=").concat(clientId);
      } else {
        authUrl = "".concat(baseUrl, "?response_type=token&client_id=").concat(clientId);
      }
      if (redirectUri) {
        authUrl += "&redirect_uri=".concat(redirectUri);
      }
      if (state) {
        authUrl += "&state=".concat(state);
      }
      if (tokenAccessType) {
        authUrl += "&token_access_type=".concat(tokenAccessType);
      }
      if (scope) {
        authUrl += "&scope=".concat(scope.join(" "));
      }
      if (includeGrantedScopes !== "none") {
        authUrl += "&include_granted_scopes=".concat(includeGrantedScopes);
      }
      if (usePKCE) {
        return this.generatePKCECodes().then(function() {
          authUrl += "&code_challenge_method=S256";
          authUrl += "&code_challenge=".concat(_this2.codeChallenge);
          return authUrl;
        });
      }
      return Promise.resolve(authUrl);
    }
    /**
       * Get an OAuth2 access token from an OAuth2 Code.
       * @arg {String} redirectUri - A URL to redirect the user to after
       * authenticating. This must be added to your app through the admin interface.
       * @arg {String} code - An OAuth2 code.
       * @returns {Object} An object containing the token and related info (if applicable)
       */
  }, {
    key: "getAccessTokenFromCode",
    value: function getAccessTokenFromCode(redirectUri, code) {
      var clientId = this.getClientId();
      var clientSecret = this.getClientSecret();
      if (!clientId) {
        throw new Error("A client id is required. You can set the client id using .setClientId().");
      }
      var path = OAuth2TokenUrl(this.domain, this.domainDelimiter);
      path += "?grant_type=authorization_code";
      path += "&code=".concat(code);
      path += "&client_id=".concat(clientId);
      if (clientSecret) {
        path += "&client_secret=".concat(clientSecret);
      } else {
        if (!this.codeVerifier) {
          throw new Error("You must use PKCE when generating the authorization URL to not include a client secret");
        }
        path += "&code_verifier=".concat(this.codeVerifier);
      }
      if (redirectUri) {
        path += "&redirect_uri=".concat(redirectUri);
      }
      var fetchOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      };
      return this.fetch(path, fetchOptions).then(function(res) {
        return parseResponse(res);
      });
    }
    /**
       * Checks if a token is needed, can be refreshed and if the token is expired.
       * If so, attempts to refresh access token
       * @returns {Promise<*>}
       */
  }, {
    key: "checkAndRefreshAccessToken",
    value: function checkAndRefreshAccessToken() {
      var canRefresh = this.getRefreshToken() && this.getClientId();
      var needsRefresh = !this.getAccessTokenExpiresAt() || new Date(Date.now() + TokenExpirationBuffer) >= this.getAccessTokenExpiresAt();
      var needsToken = !this.getAccessToken();
      if ((needsRefresh || needsToken) && canRefresh) {
        return this.refreshAccessToken();
      }
      return Promise.resolve();
    }
    /**
       * Refreshes the access token using the refresh token, if available
       * @arg {Array<String>} scope - a subset of scopes from the original
       * refresh to acquire with an access token
       * @returns {Promise<*>}
       */
  }, {
    key: "refreshAccessToken",
    value: function refreshAccessToken() {
      var _this3 = this;
      var scope = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : null;
      var clientId = this.getClientId();
      var clientSecret = this.getClientSecret();
      if (!clientId) {
        throw new Error("A client id is required. You can set the client id using .setClientId().");
      }
      if (scope && !(scope instanceof Array)) {
        throw new Error("Scope must be an array of strings");
      }
      var refreshUrl = OAuth2TokenUrl(this.domain, this.domainDelimiter);
      var fetchOptions = {
        headers: {
          "Content-Type": "application/json"
        },
        method: "POST"
      };
      if (this.dataOnBody) {
        var body = {
          grant_type: "refresh_token",
          client_id: clientId,
          refresh_token: this.getRefreshToken()
        };
        if (clientSecret) {
          body.client_secret = clientSecret;
        }
        if (scope) {
          body.scope = scope.join(" ");
        }
        fetchOptions.body = body;
      } else {
        refreshUrl += "?grant_type=refresh_token&refresh_token=".concat(this.getRefreshToken());
        refreshUrl += "&client_id=".concat(clientId);
        if (clientSecret) {
          refreshUrl += "&client_secret=".concat(clientSecret);
        }
        if (scope) {
          refreshUrl += "&scope=".concat(scope.join(" "));
        }
      }
      return this.fetch(refreshUrl, fetchOptions).then(function(res) {
        return parseResponse(res);
      }).then(function(res) {
        _this3.setAccessToken(res.result.access_token);
        _this3.setAccessTokenExpiresAt(getTokenExpiresAtDate(res.result.expires_in));
      });
    }
  }]);
  return DropboxAuth2;
}();

// node_modules/dropbox/es/src/dropbox.js
function _classCallCheck4(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties2(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass2(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties2(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties2(Constructor, staticProps);
  return Constructor;
}
var b64 = typeof btoa === "undefined" ? function(str) {
  return Buffer.from(str).toString("base64");
} : btoa;
var Dropbox = function() {
  function Dropbox2(options) {
    _classCallCheck4(this, Dropbox2);
    options = options || {};
    if (options.auth) {
      this.auth = options.auth;
    } else {
      this.auth = new DropboxAuth(options);
    }
    this.fetch = options.fetch || this.auth.fetch;
    this.selectUser = options.selectUser;
    this.selectAdmin = options.selectAdmin;
    this.pathRoot = options.pathRoot;
    this.domain = options.domain || this.auth.domain;
    this.domainDelimiter = options.domainDelimiter || this.auth.domainDelimiter;
    this.customHeaders = options.customHeaders || this.auth.customHeaders;
    Object.assign(this, routes);
  }
  _createClass2(Dropbox2, [{
    key: "request",
    value: function request(path, args, auth, host, style) {
      switch (style) {
        case RPC:
          return this.rpcRequest(path, args, auth, host);
        case DOWNLOAD:
          return this.downloadRequest(path, args, auth, host);
        case UPLOAD:
          return this.uploadRequest(path, args, auth, host);
        default:
          throw new Error("Invalid request style: ".concat(style));
      }
    }
  }, {
    key: "rpcRequest",
    value: function rpcRequest(path, body, auth, host) {
      var _this = this;
      return this.auth.checkAndRefreshAccessToken().then(function() {
        var fetchOptions = {
          method: "POST",
          body: body ? JSON.stringify(body) : null,
          headers: {}
        };
        if (body) {
          fetchOptions.headers["Content-Type"] = "application/json";
        }
        _this.setAuthHeaders(auth, fetchOptions);
        _this.setCommonHeaders(fetchOptions);
        return fetchOptions;
      }).then(function(fetchOptions) {
        return _this.fetch(baseApiUrl(host, _this.domain, _this.domainDelimiter) + path, fetchOptions);
      }).then(function(res) {
        return parseResponse(res);
      });
    }
  }, {
    key: "downloadRequest",
    value: function downloadRequest(path, args, auth, host) {
      var _this2 = this;
      return this.auth.checkAndRefreshAccessToken().then(function() {
        var fetchOptions = {
          method: "POST",
          headers: {
            "Dropbox-API-Arg": httpHeaderSafeJson(args)
          }
        };
        _this2.setAuthHeaders(auth, fetchOptions);
        _this2.setCommonHeaders(fetchOptions);
        return fetchOptions;
      }).then(function(fetchOptions) {
        return _this2.fetch(baseApiUrl(host, _this2.domain, _this2.domainDelimiter) + path, fetchOptions);
      }).then(function(res) {
        return parseDownloadResponse(res);
      });
    }
  }, {
    key: "uploadRequest",
    value: function uploadRequest(path, args, auth, host) {
      var _this3 = this;
      return this.auth.checkAndRefreshAccessToken().then(function() {
        var contents = args.contents;
        delete args.contents;
        var fetchOptions = {
          body: contents,
          method: "POST",
          headers: {
            "Content-Type": "application/octet-stream",
            "Dropbox-API-Arg": httpHeaderSafeJson(args)
          }
        };
        _this3.setAuthHeaders(auth, fetchOptions);
        _this3.setCommonHeaders(fetchOptions);
        return fetchOptions;
      }).then(function(fetchOptions) {
        return _this3.fetch(baseApiUrl(host, _this3.domain, _this3.domainDelimiter) + path, fetchOptions);
      }).then(function(res) {
        return parseResponse(res);
      });
    }
  }, {
    key: "setAuthHeaders",
    value: function setAuthHeaders(auth, fetchOptions) {
      if (auth.split(",").length > 1) {
        var authTypes = auth.replace(" ", "").split(",");
        if (authTypes.includes(USER_AUTH) && this.auth.getAccessToken()) {
          auth = USER_AUTH;
        } else if (authTypes.includes(TEAM_AUTH) && this.auth.getAccessToken()) {
          auth = TEAM_AUTH;
        } else if (authTypes.includes(APP_AUTH)) {
          auth = APP_AUTH;
        }
      }
      switch (auth) {
        case APP_AUTH:
          if (this.auth.clientId && this.auth.clientSecret) {
            var authHeader = b64("".concat(this.auth.clientId, ":").concat(this.auth.clientSecret));
            fetchOptions.headers.Authorization = "Basic ".concat(authHeader);
          }
          break;
        case TEAM_AUTH:
        case USER_AUTH:
          if (this.auth.getAccessToken()) {
            fetchOptions.headers.Authorization = "Bearer ".concat(this.auth.getAccessToken());
          }
          break;
        case NO_AUTH:
        case COOKIE:
          break;
        default:
          throw new Error("Unhandled auth type: ".concat(auth));
      }
    }
  }, {
    key: "setCommonHeaders",
    value: function setCommonHeaders(options) {
      var _this4 = this;
      if (this.selectUser) {
        options.headers["Dropbox-API-Select-User"] = this.selectUser;
      }
      if (this.selectAdmin) {
        options.headers["Dropbox-API-Select-Admin"] = this.selectAdmin;
      }
      if (this.pathRoot) {
        options.headers["Dropbox-API-Path-Root"] = this.pathRoot;
      }
      if (this.customHeaders) {
        var headerKeys = Object.keys(this.customHeaders);
        headerKeys.forEach(function(header) {
          options.headers[header] = _this4.customHeaders[header];
        });
      }
    }
  }]);
  return Dropbox2;
}();
export {
  Dropbox,
  DropboxAuth,
  DropboxResponse,
  DropboxResponseError
};
//# sourceMappingURL=dropbox.js.map
