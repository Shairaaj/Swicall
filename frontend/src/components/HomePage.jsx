// components/HomePage.jsx
import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #f8f9fa; /* Light background */
  font-family: "Arial", sans-serif;
  text-align: center;
  padding: 20px;
`;

const ContentWrapper = styled.div`
  background: #ffffff; /* White box */
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  width: 90%;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 15px;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  color: #444;
  margin-top: 20px;
`;

const Paragraph = styled.p`
  font-size: 1rem;
  color: #555;
  line-height: 1.6;
  margin-bottom: 15px;

  a {
    color: #007bff;
    text-decoration: none;
    font-weight: bold;
    &:hover {
      text-decoration: underline;
    }
  }
`;

const Button = styled.button`
  padding: 12px 24px;
  font-size: 1rem;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  margin-top: 20px;
  display: inline-block;
`;

const HomePage = () => {
  return (
    <Container>
      <ContentWrapper>
        <Title>Welcome to Swicall</Title>
        <Paragraph>
          Swicall helps you sync and manage your contacts easily. Our app
          securely accesses your contacts to provide a seamless experience.
        </Paragraph>
        <SectionTitle>Why We Need Permissions?</SectionTitle>
        <Paragraph>
          We request access to your contacts to allow you to sync and manage
          them efficiently. We do not store or share your data with third
          parties.
        </Paragraph>
        <SectionTitle>Privacy Policy</SectionTitle>
        <Paragraph>
          You can read our full privacy policy <a href="/privacy">here</a>.
        </Paragraph>
        <SectionTitle>Get Started</SectionTitle>
        <StyledLink to="/sync">
          <Button>Sync Contacts</Button>
        </StyledLink>
      </ContentWrapper>
    </Container>
  );
};

export default HomePage;
