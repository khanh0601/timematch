const handlePrepareQuestion = questions => {
  if (questions?.length === 0 || !Array.isArray(questions)) {
    return [];
  }

  const newList = questions.map(q => {
    const { key_id, ...rest } = q;
    return rest;
  });

  return newList;
};

export default {
  handlePrepareQuestion,
};
