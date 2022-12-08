import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from './../src/app.module';
import request from 'supertest';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  beforeEach(async () => {
    await request(app).delete('/testing/all-data');
  });

  it('', async () => {
    const createdBlog = await request(app)
      .post('/blogs')
      .send({
        name: 'new blog',
        description: 'new description',
        websiteUrl: 'https://someurl.com',
      })
      .expect(201);

    await request(app).get(`/blogs/0`).expect(404);

    await request(app).get(`/blogs/${createdBlog.body.id}`).expect(200);

    await request(app)
      .put('/blogs/0')
      .send({
        name: 'old blog',
        description: 'old description',
        websiteUrl: 'https://someoldurl.com',
      })
      .expect(404);

    await request(app)
      .put(`/blogs/${createdBlog.body.id}`)
      .send({
        name: 'old blog',
        description: 'old description',
        websiteUrl: 'https://someoldurl.com',
      })
      .expect(204);

    await request(app).delete(`/blogs/${createdBlog.body.id}`).expect(204);

    await request(app).delete(`/blogs/${createdBlog.body.id}`).expect(404);

    await request(app)
      .post(`/blogs/0`)
      .send({
        title: 'New title',
        shortDescription: 'New shortDescription',
        content: 'New content!!!!!!!!!!',
      })
      .expect(404);

    const createdPost = await request(app)
      .post(`/blogs/${createdBlog.body.id}/posts`)
      .send({
        title: 'New title',
        shortDescription: 'New shortDescription',
        content: 'New content!!!!!!!!!!',
      })
      .expect(201);

    await request(app).post(`/blogs/0/posts`).expect(404);

    await request(app).post(`/blogs/${createdBlog.body.id}/posts`).expect(200);
  });
});
