import express from 'express';

const router = express.Router();

router.post('/', (req: any, res: any) => {
  try {
    res.json({ 
      url: 'https://via.placeholder.com/800x400?text=Uploaded+Image',
      message: 'Image upload feature coming soon! For now, using placeholder image.'
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

export default router;
