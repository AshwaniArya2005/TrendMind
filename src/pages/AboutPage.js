import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Avatar,
  Divider,
} from '@mui/material';
import Header from '../components/Header';
import Footer from '../components/Footer';

// Mock team members data
const teamMembers = [
  {
    name: 'Alex Johnson',
    role: 'Founder & CEO',
    bio: 'Machine learning expert with 10+ years of experience in AI research. Previously led ML teams at Google and Meta.',
    avatar: '/assets/team1.png',
  },
  {
    name: 'Sarah Chen',
    role: 'CTO',
    bio: 'PhD in Computer Science from Stanford. Specialized in natural language processing and deep learning architectures.',
    avatar: '/assets/team2.png',
  },
  {
    name: 'Michael Rodriguez',
    role: 'Lead Engineer',
    bio: 'Full-stack developer with extensive experience building AI-powered applications and platforms.',
    avatar: '/assets/team3.png',
  },
  {
    name: 'Priya Sharma',
    role: 'AI Research Lead',
    bio: 'Published researcher in the field of computer vision and multimodal AI systems.',
    avatar: '/assets/team4.png',
  },
];

const AboutPage = () => {
  return (
    <>
      <Header />
      
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography 
          variant="h3" 
          component="h1" 
          gutterBottom
          sx={{ 
            fontWeight: 700,
            color: '#18445c',
            textAlign: 'center',
            mb: 2
          }}
        >
          About Us
        </Typography>
        
        <Typography 
          variant="subtitle1" 
          sx={{ 
            mb: 6,
            textAlign: 'center',
            maxWidth: 800,
            mx: 'auto',
            color: '#546e7a'
          }}
        >
          Our mission is to make AI models accessible, comparable, and understandable for everyone.
        </Typography>
        
        <Grid container spacing={4} sx={{ mb: 8 }}>
          <Grid item xs={12} md={6}>
            <Typography 
              variant="h4" 
              component="h2" 
              gutterBottom
              sx={{ 
                fontWeight: 600,
                color: '#18445c'
              }}
            >
              Our Story
            </Typography>
            
            <Typography paragraph>
              TrendMind began in 2023 when a group of AI researchers and engineers realized how difficult it was to keep track of the rapidly evolving AI model landscape. With new models being released almost daily, we found ourselves spending hours researching, comparing, and evaluating different options.
            </Typography>
            
            <Typography paragraph>
              We built TrendMind to solve this problem – creating a central hub where anyone can discover, compare, and understand the latest AI models. Our platform aggregates information from multiple sources including research papers, model repositories, and developer communities.
            </Typography>
            
            <Typography paragraph>
              Today, TrendMind serves thousands of AI enthusiasts, researchers, and developers who use our platform to stay informed about the latest advancements in artificial intelligence.
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src="/assets/about-illustration.png"
              alt="About TrendMind illustration"
              sx={{
                width: '100%',
                height: 'auto',
                borderRadius: 2,
              }}
            />
          </Grid>
        </Grid>
        
        <Divider sx={{ mb: 6 }} />
        
        <Typography 
          variant="h4" 
          component="h2" 
          gutterBottom
          sx={{ 
            fontWeight: 600,
            color: '#18445c',
            textAlign: 'center',
            mb: 5
          }}
        >
          Meet Our Team
        </Typography>
        
        <Grid container spacing={4}>
          {teamMembers.map((member, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 3,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  border: '1px solid #e0e0e0',
                  borderRadius: 2
                }}
              >
                <Avatar
                  src={member.avatar}
                  alt={member.name}
                  sx={{ 
                    width: 120, 
                    height: 120,
                    mb: 2
                  }}
                />
                
                <Typography variant="h6" gutterBottom>
                  {member.name}
                </Typography>
                
                <Typography 
                  variant="subtitle2" 
                  sx={{ 
                    color: '#0277bd',
                    mb: 2
                  }}
                >
                  {member.role}
                </Typography>
                
                <Typography variant="body2" color="text.secondary">
                  {member.bio}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
      
      <Footer />
    </>
  );
};

export default AboutPage; 