export interface Project {
    config: {
        comment: string,
        created: Date
        iamMode: string,
        id: number,
        inodeSpace: number,
        inodeSpaceMask: number,
        isInodeSpaceOwner: boolean,
        maxNumInodes: number,
        oid: number,
        parentId: number,
        path: string,
        permissionChangeMode: string,
        rootInode: number,
        snapId: number,
        status: string
      },
      filesetName: string,
      filesystemName: string,
      usage: {
        allocatedInodes: number,
        inodeSpaceFreeInodes: number,
        inodeSpaceUsedInodes: number,
        usedBytes: number,
        usedInodes: number
      }
}

export interface AddProjectResponse {
  resp: string;
}

export interface DeleteProjectResponse {
  resp: string;
}