import mongoose from 'mongoose';
import supertest from 'supertest';
import { app } from '../app';
import * as util from '../models/application';
import { Article } from '../types';

const fetchArticleByIdSpy = jest.spyOn(util, 'fetchArticleById');
const updateArticleByIdSpy = jest.spyOn(util, 'updateArticleById');

const mockArticle: Article = {
  _id: new mongoose.Types.ObjectId('65e9b5a995b6c7045a30d824'),
  title: 'Some Title',
  body: 'Body text',
};

describe('Article API', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  describe('GET /getArticleById/:articleID', () => {
    it('should return an article in the response body given a valid id', async () => {
      const mockReqParams = {
        articleID: '65e9b5a995b6c7045a30d824',
      };
      fetchArticleByIdSpy.mockResolvedValueOnce(mockArticle);
      // Making the request
      const response = await supertest(app).get(
        `/article/getArticleById/${mockReqParams.articleID}`,
      );

      // Asserting the response
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        ...mockArticle,
        _id: mockArticle._id?.toString(),
      });
    });

    it('should return bad request error if the article id is not in the correct format', async () => {
      const mockReqParams = {
        articleID: 'invalid id',
      };
      // Making the request
      const response = await supertest(app).get(
        `/article/getArticleById/${mockReqParams.articleID}`,
      );

      // Asserting the response
      expect(response.status).toBe(400);
      expect(response.text).toBe('Invalid ID format');
    });

    it('should return 500 if error occurs while fetching article by ID', async () => {
      const mockReqParams = {
        articleID: '65e9b5a995b6c7045a30d824',
      };

      fetchArticleByIdSpy.mockResolvedValueOnce({ error: 'Error while fetching' });

      // Making the request
      const response = await supertest(app).get(
        `/article/getArticleById/${mockReqParams.articleID}`,
      );

      // Asserting the response
      expect(response.status).toBe(500);
    });
  });

  describe('PUT /updateArticle/:articleID', () => {
    it('should return the updated article if the update is successful', async () => {
      const mockArticleID = mockArticle._id!;
      const mockArticleBody = {
        newArticle: {
          title: 'new title',
          body: 'new body',
        },
      };
      const expectedArticle: Article = {
        _id: mockArticleID,
        title: 'new title',
        body: 'new body',
      };

      updateArticleByIdSpy.mockResolvedValueOnce(expectedArticle);

      const response = await supertest(app)
        .put(`/article/updateArticle/${mockArticleID.toString()}`)
        .send(mockArticleBody);

      expect(response.status).toBe(200);
      expect(response.body._id).toEqual(expectedArticle._id?.toString());
      expect(response.body.title).toEqual(expectedArticle.title);
      expect(response.body.body).toEqual(expectedArticle.body);
    });
    it('should return a 400 status if the articleID is invalid', async () => {
      const mockArticleID = 'invalid ID';
      const mockArticleBody = {
        newArticle: {
          title: 'new title',
          body: 'new body',
        },
      };
      const response = await supertest(app)
        .put(`/article/updateArticle/${mockArticleID.toString()}`)
        .send(mockArticleBody);

      expect(response.status).toBe(400);
      expect(response.text).toBe('Invalid ID format');
    });
    it('should return a 400 status if the article is invalid', async () => {
      const mockArticleID = mockArticle._id!;
      const mockArticleBody = {
        newArticle: {
          title: 'new title',
        },
      };
      const response = await supertest(app)
        .put(`/article/updateArticle/${mockArticleID.toString()}`)
        .send(mockArticleBody);

      expect(response.status).toBe(400);
      expect(response.text).toBe('Invalid request body');
    });
    it('should return a 500 status if updateArticleById returns an error', async () => {
      const mockArticleID = mockArticle._id!;
      const mockArticleBody = {
        newArticle: {
          title: 'new title',
          body: 'new body',
        },
      };

      updateArticleByIdSpy.mockResolvedValueOnce({ error: 'error' });
      const response = await supertest(app)
        .put(`/article/updateArticle/${mockArticleID.toString()}`)
        .send(mockArticleBody);

      expect(response.status).toBe(500);
      expect(response.text).toBe('error');
    });
  });
});
