// src/services/courseTreeService.js
import * as lessonModel from "../models/lessonModel.js";
import * as chapterModel from "../models/chapterModel.js";

export const buildCourseTree = async (course_id) => {
  const lessons = await lessonModel.listLessonsForCourse(course_id);

  const lessonTrees = [];

  for (const lesson of lessons) {
    const chapters = await chapterModel.fetchAllChaptersByLessonId(lesson.id);

    lessonTrees.push({
      ...lesson,
      chapters   // nested here ✔️
    });
  }

  return lessonTrees;
};
