import mongoose from 'mongoose';
import supertest from 'supertest';
import { ObjectId } from 'mongodb';
import { app } from '../app';
import * as util from '../models/application';
import { Article } from '../types';

const fetchArticleByIdSpy = jest.spyOn(util, 'fetchArticleById');

const mockArticle: Article = {
  _id: new ObjectId('65e9b5a995b6c7045a30d824'),
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
});
