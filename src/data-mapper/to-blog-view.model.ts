import { BlogDBModel } from '../modules/super-admin/infrastructure/entity/blog-db.model';

export const toBlogViewModel = (blogDB: BlogDBModel) => {
  return {
    id: blogDB.id,
    name: blogDB.name,
    description: blogDB.description,
    websiteUrl: blogDB.websiteUrl,
    createdAt: blogDB.createdAt,
  };
};
