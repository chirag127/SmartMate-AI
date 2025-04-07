const aiService = require('../utils/aiService');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Mock the Google Generative AI
jest.mock('@google/generative-ai');

describe('AI Service', () => {
  let mockGenerateContent;
  let mockResponse;
  
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Setup mocks
    mockResponse = {
      text: jest.fn().mockReturnValue('Mocked AI response')
    };
    
    mockGenerateContent = jest.fn().mockResolvedValue({
      response: mockResponse
    });
    
    const mockModel = {
      generateContent: mockGenerateContent
    };
    
    GoogleGenerativeAI.mockImplementation(() => ({
      getGenerativeModel: jest.fn().mockReturnValue(mockModel)
    }));
  });
  
  describe('summarize', () => {
    it('should call Gemini API with correct prompt for summarization', async () => {
      const text = 'This is a long text that needs to be summarized.';
      const length = 'short';
      
      const result = await aiService.summarize(text, length);
      
      expect(result).toEqual('Mocked AI response');
      expect(mockGenerateContent).toHaveBeenCalledTimes(1);
      expect(mockGenerateContent.mock.calls[0][0]).toContain('Summarize');
      expect(mockGenerateContent.mock.calls[0][0]).toContain(text);
      expect(mockGenerateContent.mock.calls[0][0]).toContain('very concise');
    });
    
    it('should use medium length by default', async () => {
      const text = 'This is a long text that needs to be summarized.';
      
      await aiService.summarize(text);
      
      expect(mockGenerateContent.mock.calls[0][0]).toContain('moderately detailed');
    });
    
    it('should handle API errors', async () => {
      mockGenerateContent.mockRejectedValue(new Error('API Error'));
      
      await expect(aiService.summarize('test')).rejects.toThrow('Failed to summarize text');
    });
  });
  
  describe('rewrite', () => {
    it('should call Gemini API with correct prompt for rewriting', async () => {
      const text = 'This is a text that needs to be rewritten.';
      const tone = 'formal';
      
      const result = await aiService.rewrite(text, tone);
      
      expect(result).toEqual('Mocked AI response');
      expect(mockGenerateContent).toHaveBeenCalledTimes(1);
      expect(mockGenerateContent.mock.calls[0][0]).toContain('Rewrite');
      expect(mockGenerateContent.mock.calls[0][0]).toContain(text);
      expect(mockGenerateContent.mock.calls[0][0]).toContain('formal tone');
    });
    
    it('should use neutral tone by default', async () => {
      const text = 'This is a text that needs to be rewritten.';
      
      await aiService.rewrite(text);
      
      expect(mockGenerateContent.mock.calls[0][0]).toContain('neutral tone');
    });
  });
  
  describe('expand', () => {
    it('should call Gemini API with correct prompt for expansion', async () => {
      const text = 'This is a short text that needs to be expanded.';
      const length = 'long';
      
      const result = await aiService.expand(text, length);
      
      expect(result).toEqual('Mocked AI response');
      expect(mockGenerateContent).toHaveBeenCalledTimes(1);
      expect(mockGenerateContent.mock.calls[0][0]).toContain('Expand');
      expect(mockGenerateContent.mock.calls[0][0]).toContain(text);
      expect(mockGenerateContent.mock.calls[0][0]).toContain('about three times');
    });
    
    it('should use medium length by default', async () => {
      const text = 'This is a short text that needs to be expanded.';
      
      await aiService.expand(text);
      
      expect(mockGenerateContent.mock.calls[0][0]).toContain('about twice');
    });
  });
  
  describe('adjustTone', () => {
    it('should call Gemini API with correct prompt for tone adjustment', async () => {
      const text = 'This is a text that needs tone adjustment.';
      const tone = 'persuasive';
      
      const result = await aiService.adjustTone(text, tone);
      
      expect(result).toEqual('Mocked AI response');
      expect(mockGenerateContent).toHaveBeenCalledTimes(1);
      expect(mockGenerateContent.mock.calls[0][0]).toContain('Rewrite');
      expect(mockGenerateContent.mock.calls[0][0]).toContain(text);
      expect(mockGenerateContent.mock.calls[0][0]).toContain('persuasive tone');
    });
  });
});
