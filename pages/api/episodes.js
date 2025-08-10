import { MongoClient, ObjectId } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = 'banglaserial';

export default async function handler(req, res) {
  if (!MONGODB_URI) {
    return res.status(500).json({ 
      success: false, 
      message: 'MongoDB URI not configured' 
    });
  }

  let client;

  try {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    const db = client.db(DB_NAME);
    const collection = db.collection('episodes');

    switch (req.method) {
      case 'GET':
        try {
          const { serial_id, id } = req.query;
          
          if (id) {
            // Get single episode
            const episode = await collection.findOne({ _id: id });
            if (!episode) {
              return res.status(404).json({ 
                success: false, 
                message: 'Episode not found' 
              });
            }
            return res.status(200).json({ 
              success: true, 
              data: episode 
            });
          } else if (serial_id) {
            // Get episodes for specific serial
            const episodes = await collection
              .find({ serial_id })
              .sort({ episode_number: -1 })
              .toArray();
            return res.status(200).json({ 
              success: true, 
              data: episodes 
            });
          } else {
            // Get all episodes
            const episodes = await collection
              .find({})
              .sort({ release_date: -1 })
              .toArray();
            return res.status(200).json({ 
              success: true, 
              data: episodes 
            });
          }
        } catch (error) {
          return res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch episodes: ' + error.message 
          });
        }

      case 'POST':
        try {
          const {
            video_url,
            episode_number,
            release_date,
            serial_id
          } = req.body;

          if (!video_url || !serial_id) {
            return res.status(400).json({ 
              success: false, 
              message: 'Video URL and serial ID are required' 
            });
          }

          // Check if episode number already exists for this serial
          if (episode_number) {
            const existingEpisode = await collection.findOne({ 
              serial_id, 
              episode_number: parseInt(episode_number) 
            });
            if (existingEpisode) {
              return res.status(400).json({ 
                success: false, 
                message: 'Episode number already exists for this serial' 
              });
            }
          }

          const newEpisode = {
            _id: `ep${Date.now()}${Math.floor(Math.random() * 1000)}`,
            video_url,
            episode_number: episode_number ? parseInt(episode_number) : null,
            release_date: release_date ? new Date(release_date) : new Date(),
            serial_id
          };

          const result = await collection.insertOne(newEpisode);
          
          if (result.acknowledged) {
            return res.status(201).json({ 
              success: true, 
              message: 'Episode created successfully',
              data: newEpisode
            });
          } else {
            return res.status(500).json({ 
              success: false, 
              message: 'Failed to create episode' 
            });
          }
        } catch (error) {
          return res.status(500).json({ 
            success: false, 
            message: 'Failed to create episode: ' + error.message 
          });
        }

      case 'PUT':
        try {
          const { id } = req.query;
          const {
            video_url,
            episode_number,
            release_date,
            serial_id
          } = req.body;

          if (!id) {
            return res.status(400).json({ 
              success: false, 
              message: 'Episode ID is required' 
            });
          }

          if (!video_url) {
            return res.status(400).json({ 
              success: false, 
              message: 'Video URL is required' 
            });
          }

          // Check if episode number already exists for this serial (excluding current episode)
          if (episode_number && serial_id) {
            const existingEpisode = await collection.findOne({ 
              serial_id, 
              episode_number: parseInt(episode_number),
              _id: { $ne: id }
            });
            if (existingEpisode) {
              return res.status(400).json({ 
                success: false, 
                message: 'Episode number already exists for this serial' 
              });
            }
          }

          const updateData = {
            video_url,
            episode_number: episode_number ? parseInt(episode_number) : null,
            release_date: release_date ? new Date(release_date) : new Date()
          };

          if (serial_id) updateData.serial_id = serial_id;

          const result = await collection.updateOne(
            { _id: id },
            { $set: updateData }
          );

          if (result.matchedCount === 0) {
            return res.status(404).json({ 
              success: false, 
              message: 'Episode not found' 
            });
          }

          if (result.modifiedCount > 0) {
            return res.status(200).json({ 
              success: true, 
              message: 'Episode updated successfully' 
            });
          } else {
            return res.status(200).json({ 
              success: true, 
              message: 'No changes made to episode' 
            });
          }
        } catch (error) {
          return res.status(500).json({ 
            success: false, 
            message: 'Failed to update episode: ' + error.message 
          });
        }

      case 'DELETE':
        try {
          const { id } = req.query;

          if (!id) {
            return res.status(400).json({ 
              success: false, 
              message: 'Episode ID is required' 
            });
          }

          const result = await collection.deleteOne({ _id: id });

          if (result.deletedCount === 0) {
            return res.status(404).json({ 
              success: false, 
              message: 'Episode not found' 
            });
          }

          return res.status(200).json({ 
            success: true, 
            message: 'Episode deleted successfully' 
          });
        } catch (error) {
          return res.status(500).json({ 
            success: false, 
            message: 'Failed to delete episode: ' + error.message 
          });
        }

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        return res.status(405).json({ 
          success: false, 
          message: `Method ${req.method} not allowed` 
        });
    }
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: 'Database connection failed: ' + error.message 
    });
  } finally {
    if (client) {
      await client.close();
    }
  }
}