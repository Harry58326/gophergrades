import {
  Badge,
  Box,
  Collapse,
  HStack,
  IconButton,
  Tag,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";
import { ChevronDownIcon, ChevronRightIcon } from "@chakra-ui/icons";
import Stats from "./Stats";
import Card from "./Card";
import { letterToColor, termToName } from "../lib/letterTo";

const sortingFunctions = {
  NONE: (array) => array,
  AVERAGE_GPA: (array) =>
    array
      .sort((a, b) => (b.mostStudentsPercent < a.mostStudentsPercent ? -1 : 1))
      .sort((a, b) => (b.averageGPA < a.averageGPA ? -1 : 1)),
  RECENCY: (array) => array.sort((a, b) => (a.term < b.term ? 1 : -1)),
};

const SingleDistribution = ({ dist, isMobile, isStatic }) => {
  const { isOpen, onToggle } = useDisclosure();
  const title = dist.title ?? "Unknown";
  return (
    <Box pos={"relative"} width={"full"}>
      <Card
        key={dist.distribution_id}
        isSummary={dist.isSummary}
        href={isStatic ? "#" : dist.href}
        isStatic={isStatic}
      >
        <HStack
          justify={"center"}
          align={"center"}
          width={"100%"}
          flexWrap={"wrap"}
        >
          <VStack align={"start"} flexGrow={1} pb={4} width={"50%"}>
            {!dist.hideTitle && (
              <Text
                fontSize={dist.isSummary ? "3xl" : "lg"}
                fontWeight={"bold"}
              >
                {(!isStatic || !dist.isSummary) && title}
              </Text>
            )}
            {dist.subtitle && (
              <Text fontSize={"md"} color={"gray.600"} fontWeight={"500"}>
                {dist.subtitle}
              </Text>
            )}
            <HStack>
              {dist.averageGPA > 0 && (
                <Tag
                  textAlign={"center"}
                  colorScheme={letterToColor(dist.averageGradeLetter)}
                  py={1}
                >
                  {dist.averageGradeLetter} Average ({dist.averageGPA})
                </Tag>
              )}
              <Tag
                textAlign={"center"}
                colorScheme={letterToColor(dist.mostStudents)}
                py={1}
              >
                Most Common: {dist.mostStudents} ({dist.mostStudentsPercent}
                %)
              </Tag>
            </HStack>
            {dist.info && (
              <Text fontSize={"sm"} color={"gray.600"} pt={2}>
                {dist.info}
              </Text>
            )}
          </VStack>

          <VStack>
            <HStack>
              <Badge>{dist.students} students</Badge>
              {dist.terms && (
                <Badge>
                  {dist.terms.length} term{dist.terms.length > 1 && "s"}
                </Badge>
              )}
            </HStack>
            <HStack>
              {dist.BarChart}
              {dist.averageGPA > 0 && dist.Component}
            </HStack>
          </VStack>
        </HStack>
        {dist.terms && dist.terms.length > 1 && (
          <Collapse in={isOpen} animateOpacity>
            <VStack spacing={3} p={2} pt={3}>
              {dist.terms.sort(sortingFunctions.RECENCY).map((term) => (
                <SingleDistribution
                  dist={{
                    ...term,
                    ...Stats({ distribution: term, isMobile }),
                    subtitle: termToName(term.term),
                    hideTitle: true,
                  }}
                  isMobile={isMobile}
                  isStatic={isStatic}
                />
              ))}
            </VStack>
          </Collapse>
        )}
      </Card>
      {!isStatic && dist.terms && dist.terms.length > 1 && (
        <IconButton
          pos={"absolute"}
          size={"xs"}
          top={3.5}
          left={0}
          aria-label={"toggle dropdown"}
          variant={"ghost"}
          colorScheme={"blackAlpha"}
          rounded={"full"}
          onClick={onToggle}
        >
          {isOpen ? <ChevronDownIcon /> : <ChevronRightIcon />}
        </IconButton>
      )}
    </Box>
  );
};

export const distributionsToCards = (
  array,
  isMobile,
  sortingFunc = "AVERAGE_GPA",
  isStatic = false
) =>
  array &&
  sortingFunctions[sortingFunc](
    array
      .filter((dist) => dist.title)
      .map((distribution) => ({
        ...distribution,
        ...Stats({ distribution, isMobile }),
      }))
  ).map((dist) => (
    <SingleDistribution
      key={dist.id ?? dist.title}
      dist={dist}
      isMobile={isMobile}
      isStatic={isStatic}
    />
  ));
