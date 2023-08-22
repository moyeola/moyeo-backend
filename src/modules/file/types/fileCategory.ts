export enum FileCategory {
    USERS = 'users',
    USERS_PROFILES = 'users/profiles',
    RESOURCES = 'resources',
    RESOURCES_APP = 'resources/app',
    RESOURCES_OTHER = 'resources/other',
}

export function parseFileCategoryPath(fileCategory: FileCategory): string {
    return '/' + fileCategory;
}
