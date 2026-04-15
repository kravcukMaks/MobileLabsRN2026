import React from 'react';
import styled from 'styled-components/native';
import ClickableObject from '../components/ClickableObject';
import { useThemeContext } from '../context/ThemeContext';

// --- STYLED COMPONENTS ---

const ScrollWrapper = styled.ScrollView`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const MainContainer = styled.View`
  padding: 24px;
  align-items: center;
  justify-content: flex-start;
`;

const ScoreSection = styled.View`
  width: 100%;
  background-color: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 16px;
  padding: 24px 16px;
  margin-bottom: 30px;
  align-items: center;
  elevation: 2; /* Додаємо легку тінь для Android */
  shadow-color: #000; /* Тінь для iOS */
  shadow-opacity: 0.1;
  shadow-radius: 4px;
`;

const TitleText = styled.Text`
  font-size: 16px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.mutedText};
  letter-spacing: 1px;
`;

const PointsDisplay = styled.Text`
  font-size: 42px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.primary || theme.colors.text};
  margin-top: 10px;
`;

const InfoBox = styled.View`
  width: 100%;
  background-color: ${({ theme }) => theme.colors.primarySoft};
  border-radius: 16px;
  padding: 20px;
  margin-top: 24px;
`;

const InfoHeading = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 12px;
`;

const RulesText = styled.Text`
  font-size: 15px;
  line-height: 24px;
  color: ${({ theme }) => theme.colors.text};
`;

const StatsGrid = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 24px;
`;

const StatItem = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.card};
  padding: 16px 10px;
  border-radius: 12px;
  margin: 0 5px;
  align-items: center;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const StatNumber = styled.Text`
  font-size: 22px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text};
`;

const StatDescription = styled.Text`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.mutedText};
  margin-top: 6px;
`;


// --- MAIN COMPONENT ---

export default function HomeScreen({
  score,
  stats,
  addScore,
  updateStats,
  completedCount,
}) {
  useThemeContext();

  return (
    <ScrollWrapper contentContainerStyle={{ flexGrow: 1 }}>
      <MainContainer>
        
        {/* Блок з рахунком */}
        <ScoreSection>
          <TitleText>Ваш баланс</TitleText>
          <PointsDisplay>{score}</PointsDisplay>
        </ScoreSection>

        {/* Інтерактивний об'єкт */}
        <ClickableObject
          addScore={addScore}
          updateStats={updateStats}
        />

        {/* Блок статистики */}
        <StatsGrid>
          <StatItem>
            <StatNumber>{stats.taps}</StatNumber>
            <StatDescription>Кліки</StatDescription>
          </StatItem>

          <StatItem>
            <StatNumber>{stats.doubleTaps}</StatNumber>
            <StatDescription>Дабл-клік</StatDescription>
          </StatItem>

          <StatItem>
            <StatNumber>{completedCount}</StatNumber>
            <StatDescription>Квести</StatDescription>
          </StatItem>
        </StatsGrid>

        {/* Правила гри */}
        <InfoBox>
          <InfoHeading>Інструкція</InfoHeading>
          <RulesText>
            • Звичайний тап: +1{'\n'}
            • Подвійний тап: +2{'\n'}
            • Довге натискання (3с): +5{'\n'}
            • Свайп: випадковий бонус{'\n'}
            • Зум (масштаб): спец-бонус{'\n'}
            • Об’єкт вільний для перетягування
          </RulesText>
        </InfoBox>

      </MainContainer>
    </ScrollWrapper>
  );
}